"use server";

import { connectToDB } from "../connection/mongoose";
import JournalEntry from "../models/journal-entry.model";
import GeneralLedger from "../models/general-ledger.model";
import Account from "../models/account.model";
import Product from "../models/product.model";

export async function postBillToGL(billId: string, userId: string) {
  try {
    await connectToDB();

    const Bill = (await import("../models/bill.model")).default;
    const bill = await Bill.findById(billId).lean();
    if (!bill) throw new Error("Bill not found");

    const expenseAccount = bill.expenseAccountId || await getDefaultAccount(bill.organizationId, "expense", "Purchases", userId);
    const payableAccount = bill.payableAccountId || await getDefaultAccount(bill.organizationId, "liability", "Accounts Payable", userId);
    const taxAccount = bill.taxAccountId || await getDefaultAccount(bill.organizationId, "liability", "VAT Payable", userId);

    const lineItems = [];

    // Debit: Expense Account
    lineItems.push({
      accountId: expenseAccount,
      description: `Bill ${bill.billNumber}`,
      debit: bill.subtotal,
      credit: 0
    });

    // Debit: Tax (if applicable)
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
      const account = await Account.findById(line.accountId);
      let runningBalance = account?.currentBalance || 0;
      
      if (["asset", "expense"].includes(account?.accountType || "")) {
        runningBalance += line.debit - line.credit;
      } else {
        runningBalance += line.credit - line.debit;
      }

      await GeneralLedger.create({
        organizationId: bill.organizationId,
        accountId: line.accountId,
        journalEntryId: journalEntry._id,
        transactionDate: bill.billDate,
        description: line.description,
        debit: line.debit,
        credit: line.credit,
        runningBalance,
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

export async function postBillPaymentToGL(paymentId: string, billId: string, amount: number, paymentDate: Date, userId: string) {
  try {
    await connectToDB();

    const Bill = (await import("../models/bill.model")).default;
    const bill = await Bill.findById(billId);
    if (!bill) throw new Error("Bill not found");

    const payableAccount = bill.payableAccountId || await getDefaultAccount(bill.organizationId, "liability", "Accounts Payable", userId);
    const cashAccount = await getDefaultAccount(bill.organizationId, "asset", "Cash", userId);

    const lineItems = [
      {
        accountId: payableAccount,
        description: `Payment for Bill ${bill.billNumber}`,
        debit: amount,
        credit: 0
      },
      {
        accountId: cashAccount,
        description: `Payment for Bill ${bill.billNumber}`,
        debit: 0,
        credit: amount
      }
    ];

    const journalEntry = await JournalEntry.create({
      organizationId: bill.organizationId,
      entryNumber: `JE-BP-${bill.billNumber}`,
      entryDate: paymentDate,
      entryType: "automated",
      referenceType: "bill_payment",
      referenceId: paymentId,
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

    const fiscalYear = new Date(paymentDate).getFullYear();
    const fiscalPeriod = new Date(paymentDate).getMonth() + 1;

    for (const line of lineItems) {
      const account = await Account.findById(line.accountId);
      let runningBalance = account?.currentBalance || 0;
      
      if (["asset", "expense"].includes(account?.accountType || "")) {
        runningBalance += line.debit - line.credit;
      } else {
        runningBalance += line.credit - line.debit;
      }

      await GeneralLedger.create({
        organizationId: bill.organizationId,
        accountId: line.accountId,
        journalEntryId: journalEntry._id,
        transactionDate: paymentDate,
        description: line.description,
        debit: line.debit,
        credit: line.credit,
        runningBalance,
        referenceType: "bill_payment",
        referenceId: paymentId,
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

async function getDefaultAccount(organizationId: any, accountType: string, accountName: string, userId?: string) {
  let account = await Account.findOne({
    organizationId,
    accountType,
    accountName: { $regex: accountName, $options: "i" },
    del_flag: false,
    isActive: true
  }).lean();
  
  if (!account) {
    const accountCodeMap: Record<string, number> = {
      "Accounts Payable": 2000,
      "VAT Payable": 2100,
      "Cash": 1000,
      "Purchases": 5000,
    };

    const newAccount = await Account.create({
      organizationId,
      accountCode: accountCodeMap[accountName]?.toString() || "9999",
      accountName,
      accountType,
      accountSubType: accountType === "asset" ? "Current Asset" : 
                      accountType === "expense" ? "Operating Expense" : 
                      "Current Liability",
      level: 0,
      isParent: false,
      isActive: true,
      isSystemAccount: true,
      allowManualJournal: true,
      currentBalance: 0,
      debitBalance: 0,
      creditBalance: 0,
      del_flag: false,
      createdBy: userId || organizationId,
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
