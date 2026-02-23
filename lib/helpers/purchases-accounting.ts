"use server";

import { connectToDB } from "../connection/mongoose";
import JournalEntry from "../models/journal-entry.model";
import GeneralLedger from "../models/general-ledger.model";
import Account from "../models/account.model";
import Bill from "../models/bill.model";
import PurchaseOrder from "../models/purchase-order.model";

export async function postBillToGL(billId: string, userId: string) {
  try {
    await connectToDB();

    const bill = await Bill.findById(billId).lean();
    if (!bill) throw new Error("Bill not found");

    const expenseAccount = bill.expenseAccountId 
      ? bill.expenseAccountId 
      : await getDefaultAccount(bill.organizationId, "expense", "Cost of Goods Sold");
    
    const payableAccount = bill.payableAccountId 
      ? bill.payableAccountId 
      : await getDefaultAccount(bill.organizationId, "liability", "Accounts Payable");
    
    const taxAccount = bill.taxAccountId 
      ? bill.taxAccountId 
      : await getDefaultAccount(bill.organizationId, "liability", "VAT Payable");

    const lineItems = [];

    // Debit: Expense/COGS (Expense increases)
    lineItems.push({
      accountId: expenseAccount,
      description: `Bill ${bill.billNumber}`,
      debit: bill.subtotal,
      credit: 0
    });

    // Debit: Tax (if exists)
    if (bill.taxAmount > 0) {
      lineItems.push({
        accountId: taxAccount,
        description: `VAT on Bill ${bill.billNumber}`,
        debit: bill.taxAmount,
        credit: 0
      });
    }

    // Credit: Accounts Payable (Liability increases)
    lineItems.push({
      accountId: payableAccount,
      description: `Bill ${bill.billNumber}`,
      debit: 0,
      credit: bill.total
    });

    const journalEntry = await JournalEntry.create({
      organizationId: bill.organizationId,
      entryNumber: `JE-BILL-${bill.billNumber}`,
      entryDate: bill.billDate,
      entryType: "automated",
      referenceType: "bill",
      referenceId: billId,
      referenceNumber: bill.billNumber,
      description: `Bill ${bill.billNumber}`,
      lineItems,
      totalDebit: bill.total,
      totalCredit: bill.total,
      isBalanced: true,
      status: "posted",
      postedDate: new Date(),
      postedBy: userId,
      createdBy: userId,
      del_flag: false,
      mod_flag: 0
    });

    const fiscalYear = new Date(bill.billDate).getFullYear();
    const fiscalPeriod = new Date(bill.billDate).getMonth() + 1;

    for (const line of lineItems) {
      await GeneralLedger.create({
        organizationId: bill.organizationId,
        accountId: line.accountId,
        journalEntryId: journalEntry._id,
        transactionDate: bill.billDate,
        description: line.description,
        debit: line.debit,
        credit: line.credit,
        runningBalance: 0,
        referenceType: "bill",
        referenceId: billId,
        referenceNumber: bill.billNumber,
        fiscalYear,
        fiscalPeriod,
        isReconciled: false,
        del_flag: false
      });

      await updateAccountBalance(line.accountId, line.debit, line.credit);
    }

    return { success: true, journalEntryId: journalEntry._id };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function postBillPaymentToGL(billId: string, amount: number, paymentAccountId: string, userId: string) {
  try {
    await connectToDB();

    const bill = await Bill.findById(billId).lean();
    if (!bill) throw new Error("Bill not found");

    const bankAccount = paymentAccountId 
      ? paymentAccountId 
      : await getDefaultAccount(bill.organizationId, "asset", "Cash");
    
    const payableAccount = bill.payableAccountId 
      ? bill.payableAccountId 
      : await getDefaultAccount(bill.organizationId, "liability", "Accounts Payable");

    const lineItems = [
      {
        accountId: payableAccount,
        description: `Payment for Bill ${bill.billNumber}`,
        debit: amount,
        credit: 0
      },
      {
        accountId: bankAccount,
        description: `Payment for Bill ${bill.billNumber}`,
        debit: 0,
        credit: amount
      }
    ];

    const journalEntry = await JournalEntry.create({
      organizationId: bill.organizationId,
      entryNumber: `JE-BILLPAY-${bill.billNumber}`,
      entryDate: new Date(),
      entryType: "automated",
      referenceType: "bill",
      referenceId: billId,
      referenceNumber: bill.billNumber,
      description: `Payment for Bill ${bill.billNumber}`,
      lineItems,
      totalDebit: amount,
      totalCredit: amount,
      isBalanced: true,
      status: "posted",
      postedDate: new Date(),
      postedBy: userId,
      createdBy: userId,
      del_flag: false,
      mod_flag: 0
    });

    const fiscalYear = new Date().getFullYear();
    const fiscalPeriod = new Date().getMonth() + 1;

    for (const line of lineItems) {
      await GeneralLedger.create({
        organizationId: bill.organizationId,
        accountId: line.accountId,
        journalEntryId: journalEntry._id,
        transactionDate: new Date(),
        description: line.description,
        debit: line.debit,
        credit: line.credit,
        runningBalance: 0,
        referenceType: "bill",
        referenceId: billId,
        referenceNumber: bill.billNumber,
        fiscalYear,
        fiscalPeriod,
        isReconciled: false,
        del_flag: false
      });

      await updateAccountBalance(line.accountId, line.debit, line.credit);
    }

    return { success: true, journalEntryId: journalEntry._id };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function postPurchaseOrderToGL(poId: string, userId: string) {
  try {
    await connectToDB();

    const po = await PurchaseOrder.findById(poId).lean();
    if (!po || po.status !== "received") return { success: false };

    const inventoryAccount = po.inventoryAccountId 
      ? po.inventoryAccountId 
      : await getDefaultAccount(po.organizationId, "asset", "Inventory");
    
    const payableAccount = po.payableAccountId 
      ? po.payableAccountId 
      : await getDefaultAccount(po.organizationId, "liability", "Accounts Payable");

    const lineItems = [
      {
        accountId: inventoryAccount,
        description: `PO ${po.poNumber} - Goods Received`,
        debit: po.total,
        credit: 0
      },
      {
        accountId: payableAccount,
        description: `PO ${po.poNumber} - Goods Received`,
        debit: 0,
        credit: po.total
      }
    ];

    const journalEntry = await JournalEntry.create({
      organizationId: po.organizationId,
      entryNumber: `JE-PO-${po.poNumber}`,
      entryDate: new Date(),
      entryType: "automated",
      referenceType: "other",
      referenceId: poId,
      referenceNumber: po.poNumber,
      description: `PO ${po.poNumber} - Goods Received`,
      lineItems,
      totalDebit: po.total,
      totalCredit: po.total,
      isBalanced: true,
      status: "posted",
      postedDate: new Date(),
      postedBy: userId,
      createdBy: userId,
      del_flag: false,
      mod_flag: 0
    });

    const fiscalYear = new Date().getFullYear();
    const fiscalPeriod = new Date().getMonth() + 1;

    for (const line of lineItems) {
      await GeneralLedger.create({
        organizationId: po.organizationId,
        accountId: line.accountId,
        journalEntryId: journalEntry._id,
        transactionDate: new Date(),
        description: line.description,
        debit: line.debit,
        credit: line.credit,
        runningBalance: 0,
        referenceType: "other",
        referenceId: poId,
        referenceNumber: po.poNumber,
        fiscalYear,
        fiscalPeriod,
        isReconciled: false,
        del_flag: false
      });

      await updateAccountBalance(line.accountId, line.debit, line.credit);
    }

    return { success: true, journalEntryId: journalEntry._id };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function getDefaultAccount(organizationId: any, accountType: string, accountName: string) {
  let account = await Account.findOne({
    organizationId,
    accountType,
    accountName: { $regex: accountName, $options: "i" },
    del_flag: false,
    isActive: true
  }).lean();
  
  // If account doesn't exist, create it
  if (!account) {
    const accountCodes: Record<string, string> = {
      "Cash": "1000",
      "Accounts Payable": "2000",
      "Cost of Goods Sold": "5000",
      "VAT Payable": "2100",
      "Inventory": "1300"
    };

    const newAccount = await Account.create({
      organizationId,
      accountCode: accountCodes[accountName] || "9999",
      accountName,
      accountType,
      description: `Auto-created default ${accountName} account`,
      parentId: null,
      level: 1,
      isParent: false,
      currentBalance: 0,
      debitBalance: 0,
      creditBalance: 0,
      isActive: true,
      del_flag: false,
      mod_flag: false
    });

    return newAccount._id;
  }
  
  return account._id;
}

async function updateAccountBalance(accountId: any, debit: number, credit: number) {
  const account = await Account.findById(accountId);
  if (!account) return;

  account.debitBalance += debit;
  account.creditBalance += credit;

  if (["asset", "expense"].includes(account.accountType)) {
    account.currentBalance = account.debitBalance - account.creditBalance;
  } else {
    account.currentBalance = account.creditBalance - account.debitBalance;
  }

  await account.save();
}
