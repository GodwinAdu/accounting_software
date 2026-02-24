"use server";

import { connectToDB } from "../connection/mongoose";
import JournalEntry from "../models/journal-entry.model";
import GeneralLedger from "../models/general-ledger.model";
import Account from "../models/account.model";
import Invoice from "../models/invoice.model";

export async function postInvoiceToGL(invoiceId: string, userId: string) {
  try {
    await connectToDB();

    const invoice = await Invoice.findById(invoiceId).lean();
    if (!invoice) throw new Error("Invoice not found");

    console.log("Posting invoice to GL:", invoiceId);

    const revenueAccount = invoice.revenueAccountId || await getDefaultAccount(invoice.organizationId, "revenue", "Sales Revenue", userId);
    const receivableAccount = invoice.receivableAccountId || await getDefaultAccount(invoice.organizationId, "asset", "Accounts Receivable", userId);
    const taxAccount = invoice.taxAccountId || await getDefaultAccount(invoice.organizationId, "liability", "VAT Payable", userId);

    console.log("Using accounts:", { revenueAccount, receivableAccount, taxAccount });

    const lineItems = [];

    // Debit: Accounts Receivable (Asset increases)
    lineItems.push({
      accountId: receivableAccount,
      description: `Invoice ${invoice.invoiceNumber}`,
      debit: invoice.totalAmount,
      credit: 0
    });

    // Credit: Revenue (Revenue increases)
    lineItems.push({
      accountId: revenueAccount,
      description: `Invoice ${invoice.invoiceNumber}`,
      debit: 0,
      credit: invoice.subtotal
    });

    // Credit: Tax Payable (if tax exists)
    if (invoice.taxAmount > 0) {
      lineItems.push({
        accountId: taxAccount,
        description: `VAT on Invoice ${invoice.invoiceNumber}`,
        debit: 0,
        credit: invoice.taxAmount
      });
    }

    // Create Journal Entry
    const journalEntry = await JournalEntry.create({
      organizationId: invoice.organizationId,
      entryNumber: `JE-INV-${invoice.invoiceNumber}`,
      entryDate: invoice.invoiceDate,
      entryType: "automated",
      referenceType: "invoice",
      referenceId: invoiceId,
      referenceNumber: invoice.invoiceNumber,
      description: `Invoice ${invoice.invoiceNumber}`,
      lineItems,
      totalDebit: invoice.totalAmount,
      totalCredit: invoice.totalAmount,
      isBalanced: true,
      status: "posted",
      postedDate: new Date(),
      postedBy: userId,
      createdBy: userId,
      del_flag: false,
      mod_flag: 0
    });

    // Post to General Ledger with running balance calculation
    const fiscalYear = new Date(invoice.invoiceDate).getFullYear();
    const fiscalPeriod = new Date(invoice.invoiceDate).getMonth() + 1;

    for (const line of lineItems) {
      const account = await Account.findById(line.accountId);
      let runningBalance = account?.currentBalance || 0;
      
      if (["asset", "expense"].includes(account?.accountType || "")) {
        runningBalance += line.debit - line.credit;
      } else {
        runningBalance += line.credit - line.debit;
      }

      await GeneralLedger.create({
        organizationId: invoice.organizationId,
        accountId: line.accountId,
        journalEntryId: journalEntry._id,
        transactionDate: invoice.invoiceDate,
        description: line.description,
        debit: line.debit,
        credit: line.credit,
        runningBalance,
        referenceType: "invoice",
        referenceId: invoiceId,
        referenceNumber: invoice.invoiceNumber,
        fiscalYear,
        fiscalPeriod,
        isReconciled: false,
        del_flag: false
      });

      await updateAccountBalance(line.accountId, line.debit, line.credit);
    }

    console.log("Invoice posted to GL successfully:", journalEntry._id);
    return { success: true, journalEntryId: journalEntry._id };
  } catch (error: any) {
    console.error("Error posting invoice to GL:", error);
    return { error: error.message };
  }
}

export async function postPaymentToGL(paymentId: string, userId: string) {
  try {
    await connectToDB();

    const Payment = (await import("../models/payment.model")).default;
    const payment = await Payment.findById(paymentId).lean();
    if (!payment) throw new Error("Payment not found");

    console.log("Posting payment to GL:", paymentId);

    const bankAccount = payment.bankAccountId || await getDefaultAccount(payment.organizationId, "asset", "Cash", userId);
    const receivableAccount = payment.receivableAccountId || await getDefaultAccount(payment.organizationId, "asset", "Accounts Receivable", userId);

    console.log("Using accounts:", { bankAccount, receivableAccount });

    const lineItems = [
      {
        accountId: bankAccount,
        description: `Payment ${payment.paymentNumber}`,
        debit: payment.amount,
        credit: 0
      },
      {
        accountId: receivableAccount,
        description: `Payment ${payment.paymentNumber}`,
        debit: 0,
        credit: payment.amount
      }
    ];

    const journalEntry = await JournalEntry.create({
      organizationId: payment.organizationId,
      entryNumber: `JE-PAY-${payment.paymentNumber}`,
      entryDate: payment.paymentDate,
      entryType: "automated",
      referenceType: "payment",
      referenceId: paymentId,
      referenceNumber: payment.paymentNumber,
      description: `Payment ${payment.paymentNumber}`,
      lineItems,
      totalDebit: payment.amount,
      totalCredit: payment.amount,
      isBalanced: true,
      status: "posted",
      postedDate: new Date(),
      postedBy: userId,
      createdBy: userId,
      del_flag: false,
      mod_flag: 0
    });

    const fiscalYear = new Date(payment.paymentDate).getFullYear();
    const fiscalPeriod = new Date(payment.paymentDate).getMonth() + 1;

    for (const line of lineItems) {
      // Get current balance for this account
      const account = await Account.findById(line.accountId);
      let runningBalance = account?.currentBalance || 0;
      
      // Calculate new running balance
      if (["asset", "expense"].includes(account?.accountType || "")) {
        runningBalance += line.debit - line.credit;
      } else {
        runningBalance += line.credit - line.debit;
      }

      await GeneralLedger.create({
        organizationId: payment.organizationId,
        accountId: line.accountId,
        journalEntryId: journalEntry._id,
        transactionDate: payment.paymentDate,
        description: line.description,
        debit: line.debit,
        credit: line.credit,
        runningBalance,
        referenceType: "payment",
        referenceId: paymentId,
        referenceNumber: payment.paymentNumber,
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
  
  // If account doesn't exist, create it
  if (!account) {
    const accountCodeMap: Record<string, number> = {
      "Sales Revenue": 4000,
      "Accounts Receivable": 1200,
      "VAT Payable": 2100,
      "Cash": 1000,
    };

    const newAccount = await Account.create({
      organizationId,
      accountCode: accountCodeMap[accountName]?.toString() || "9999",
      accountName,
      accountType,
      accountSubType: accountType === "revenue" ? "Sales Revenue" : 
                      accountType === "asset" ? "Current Asset" : 
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
  if (!account) {
    console.error("Account not found:", accountId);
    return;
  }

  console.log(`Updating ${account.accountName} - Before: debit=${account.debitBalance}, credit=${account.creditBalance}, balance=${account.currentBalance}`);

  account.debitBalance += debit;
  account.creditBalance += credit;

  // Calculate current balance based on account type
  if (["asset", "expense"].includes(account.accountType)) {
    account.currentBalance = account.debitBalance - account.creditBalance;
  } else {
    account.currentBalance = account.creditBalance - account.debitBalance;
  }

  await account.save();
  
  console.log(`Updated ${account.accountName} - After: debit=${account.debitBalance}, credit=${account.creditBalance}, balance=${account.currentBalance}`);
}

export async function postCreditNoteToGL(creditNoteId: string, userId: string) {
  try {
    await connectToDB();

    const CreditNote = (await import("../models/credit-note.model")).default;
    const creditNote = await CreditNote.findById(creditNoteId).lean();
    if (!creditNote) throw new Error("Credit note not found");

    const revenueAccount = creditNote.revenueAccountId || await getDefaultAccount(creditNote.organizationId, "revenue", "Sales Revenue", userId);
    const receivableAccount = creditNote.receivableAccountId || await getDefaultAccount(creditNote.organizationId, "asset", "Accounts Receivable", userId);

    const lineItems = [
      {
        accountId: revenueAccount,
        description: `Credit note ${creditNote.creditNoteNumber}`,
        debit: creditNote.total,
        credit: 0
      },
      {
        accountId: receivableAccount,
        description: `Credit note ${creditNote.creditNoteNumber}`,
        debit: 0,
        credit: creditNote.total
      }
    ];

    const journalEntry = await JournalEntry.create({
      organizationId: creditNote.organizationId,
      entryNumber: `JE-CN-${creditNote.creditNoteNumber}`,
      entryDate: creditNote.date,
      entryType: "automated",
      referenceType: "credit_note",
      referenceId: creditNoteId,
      referenceNumber: creditNote.creditNoteNumber,
      description: `Credit note ${creditNote.creditNoteNumber}`,
      lineItems,
      totalDebit: creditNote.total,
      totalCredit: creditNote.total,
      isBalanced: true,
      status: "posted",
      postedDate: new Date(),
      postedBy: userId,
      createdBy: userId,
      del_flag: false,
      mod_flag: 0
    });

    const fiscalYear = new Date(creditNote.date).getFullYear();
    const fiscalPeriod = new Date(creditNote.date).getMonth() + 1;

    for (const line of lineItems) {
      const account = await Account.findById(line.accountId);
      let runningBalance = account?.currentBalance || 0;
      
      if (["asset", "expense"].includes(account?.accountType || "")) {
        runningBalance += line.debit - line.credit;
      } else {
        runningBalance += line.credit - line.debit;
      }

      await GeneralLedger.create({
        organizationId: creditNote.organizationId,
        accountId: line.accountId,
        journalEntryId: journalEntry._id,
        transactionDate: creditNote.date,
        description: line.description,
        debit: line.debit,
        credit: line.credit,
        runningBalance,
        referenceType: "credit_note",
        referenceId: creditNoteId,
        referenceNumber: creditNote.creditNoteNumber,
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

export async function postReceiptToGL(receiptId: string, userId: string) {
  try {
    await connectToDB();

    const Receipt = (await import("../models/receipt.model")).default;
    const receipt = await Receipt.findById(receiptId).lean();
    if (!receipt) throw new Error("Receipt not found");

    const bankAccount = receipt.bankAccountId || await getDefaultAccount(receipt.organizationId, "asset", "Cash", userId);
    const revenueAccount = receipt.revenueAccountId || await getDefaultAccount(receipt.organizationId, "revenue", "Sales Revenue", userId);

    const lineItems = [
      {
        accountId: bankAccount,
        description: `Receipt ${receipt.receiptNumber}`,
        debit: receipt.totalAmount,
        credit: 0
      },
      {
        accountId: revenueAccount,
        description: `Receipt ${receipt.receiptNumber}`,
        debit: 0,
        credit: receipt.totalAmount
      }
    ];

    const journalEntry = await JournalEntry.create({
      organizationId: receipt.organizationId,
      entryNumber: `JE-REC-${receipt.receiptNumber}`,
      entryDate: receipt.receiptDate,
      entryType: "automated",
      referenceType: "receipt",
      referenceId: receiptId,
      referenceNumber: receipt.receiptNumber,
      description: `Sales Receipt ${receipt.receiptNumber}`,
      lineItems,
      totalDebit: receipt.totalAmount,
      totalCredit: receipt.totalAmount,
      isBalanced: true,
      status: "posted",
      postedDate: new Date(),
      postedBy: userId,
      createdBy: userId,
      del_flag: false,
      mod_flag: 0
    });

    const fiscalYear = new Date(receipt.receiptDate).getFullYear();
    const fiscalPeriod = new Date(receipt.receiptDate).getMonth() + 1;

    for (const line of lineItems) {
      const account = await Account.findById(line.accountId);
      let runningBalance = account?.currentBalance || 0;
      
      if (["asset", "expense"].includes(account?.accountType || "")) {
        runningBalance += line.debit - line.credit;
      } else {
        runningBalance += line.credit - line.debit;
      }

      await GeneralLedger.create({
        organizationId: receipt.organizationId,
        accountId: line.accountId,
        journalEntryId: journalEntry._id,
        transactionDate: receipt.receiptDate,
        description: line.description,
        debit: line.debit,
        credit: line.credit,
        runningBalance,
        referenceType: "receipt",
        referenceId: receiptId,
        referenceNumber: receipt.receiptNumber,
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
