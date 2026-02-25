"use server";

import { connectToDB } from "../connection/mongoose";
import JournalEntry from "../models/journal-entry.model";
import GeneralLedger from "../models/general-ledger.model";
import Account from "../models/account.model";
import Expense from "../models/expense.model";

export async function postExpenseToGL(expenseId: string, userId: string) {
  try {
    await connectToDB();

    const expense = await Expense.findById(expenseId).lean();
    if (!expense) throw new Error("Expense not found");

    const existingEntry = await JournalEntry.findOne({
      organizationId: expense.organizationId,
      referenceType: "other",
      referenceId: expenseId,
      del_flag: false
    });

    if (existingEntry) {
      console.log(`Expense ${expense.expenseNumber} already posted to GL`);
      return { success: true, journalEntryId: existingEntry._id, message: "Already posted" };
    }

    let expenseAccount = expense.expenseAccountId;
    
    if (expense.projectId) {
      const Project = (await import("../models/project.model")).default;
      const project = await Project.findById(expense.projectId);
      if (project?.expenseAccountId) {
        expenseAccount = project.expenseAccountId;
      }
    }
    
    expenseAccount = expenseAccount || await getDefaultAccount(expense.organizationId, "expense", "Operating Expenses", userId);
    const paymentAccount = expense.paymentAccountId || await getDefaultAccount(expense.organizationId, "asset", "Cash", userId);

    if (!expense.expenseAccountId || !expense.paymentAccountId) {
      await Expense.findByIdAndUpdate(expenseId, {
        expenseAccountId: expenseAccount,
        paymentAccountId: paymentAccount
      });
    }

    const lineItems = [
      {
        accountId: expenseAccount,
        description: `Expense ${expense.expenseNumber}`,
        debit: expense.amount,
        credit: 0
      },
      {
        accountId: paymentAccount,
        description: `Expense ${expense.expenseNumber}`,
        debit: 0,
        credit: expense.amount
      }
    ];

    const journalEntry = await JournalEntry.create({
      organizationId: expense.organizationId,
      entryNumber: `JE-EXP-${expense.expenseNumber}`,
      entryDate: expense.date,
      entryType: "automated",
      referenceType: "other",
      referenceId: expenseId,
      referenceNumber: expense.expenseNumber,
      description: `Expense ${expense.expenseNumber}`,
      lineItems,
      totalDebit: expense.amount,
      totalCredit: expense.amount,
      isBalanced: true,
      status: "posted",
      postedDate: new Date(),
      postedBy: userId,
      createdBy: userId,
      del_flag: false,
      mod_flag: 0
    });

    const fiscalYear = new Date(expense.date).getFullYear();
    const fiscalPeriod = new Date(expense.date).getMonth() + 1;

    for (const line of lineItems) {
      const account = await Account.findById(line.accountId);
      let runningBalance = account?.currentBalance || 0;
      
      if (["asset", "expense"].includes(account?.accountType || "")) {
        runningBalance += line.debit - line.credit;
      } else {
        runningBalance += line.credit - line.debit;
      }

      await GeneralLedger.create({
        organizationId: expense.organizationId,
        accountId: line.accountId,
        journalEntryId: journalEntry._id,
        transactionDate: expense.date,
        description: line.description,
        debit: line.debit,
        credit: line.credit,
        runningBalance,
        referenceType: "other",
        referenceId: expenseId,
        referenceNumber: expense.expenseNumber,
        fiscalYear,
        fiscalPeriod,
        isReconciled: false,
        del_flag: false
      });

      await updateAccountBalance(line.accountId, line.debit, line.credit);
    }

    if (expense.projectId) {
      const Project = (await import("../models/project.model")).default;
      await Project.findByIdAndUpdate(expense.projectId, {
        $inc: { actualCost: expense.amount }
      });
    }

    return { success: true, journalEntryId: journalEntry._id };
  } catch (error: any) {
    console.error("Post expense to GL error:", error);
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
      "Operating Expenses": 5000,
      "Cash": 1000,
    };

    const newAccount = await Account.create({
      organizationId,
      accountCode: accountCodeMap[accountName]?.toString() || "9999",
      accountName,
      accountType,
      accountSubType: accountType === "expense" ? "Operating Expenses" : "Current Asset",
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

  if (["asset", "expense"].includes(account.accountType)) {
    account.currentBalance = account.debitBalance - account.creditBalance;
  } else {
    account.currentBalance = account.creditBalance - account.debitBalance;
  }

  await account.save();
  
  console.log(`Updated ${account.accountName} - After: debit=${account.debitBalance}, credit=${account.creditBalance}, balance=${account.currentBalance}`);
}
