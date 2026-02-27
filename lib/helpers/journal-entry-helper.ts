"use server";

import JournalEntry from "../models/journal-entry.model";
import Account from "../models/account.model";

interface JournalEntryLineItem {
  accountId: string;
  description?: string;
  debit: number;
  credit: number;
}

export async function createJournalEntryForBankTransaction(
  organizationId: string,
  userId: string,
  data: {
    transactionId: string;
    transactionNumber: string;
    transactionDate: Date;
    description: string;
    bankAccountGLId?: string;
    amount: number;
    transactionType: "deposit" | "withdrawal" | "transfer" | "fee" | "interest" | "other";
    category?: string;
  }
) {
  try {
    if (!data.bankAccountGLId) {
      return { success: false, message: "Bank account not linked to GL account" };
    }

    // Get last journal entry number
    const lastEntry = await JournalEntry.findOne({ organizationId })
      .sort({ createdAt: -1 })
      .select("entryNumber");

    let nextNumber = 1;
    if (lastEntry?.entryNumber) {
      const lastNum = parseInt(lastEntry.entryNumber.split("-")[1]);
      nextNumber = lastNum + 1;
    }

    const entryNumber = `JE-${String(nextNumber).padStart(6, "0")}`;

    // Determine contra account based on transaction type and category
    let contraAccountId = await getContraAccount(organizationId, data.transactionType, data.category);

    const lineItems: JournalEntryLineItem[] = [];

    // Create line items based on transaction type
    if (data.transactionType === "deposit" || data.transactionType === "interest") {
      // Debit: Bank Account (Asset increases)
      lineItems.push({
        accountId: data.bankAccountGLId,
        description: data.description,
        debit: data.amount,
        credit: 0,
      });
      // Credit: Revenue/Income Account
      lineItems.push({
        accountId: contraAccountId,
        description: data.description,
        debit: 0,
        credit: data.amount,
      });
    } else if (data.transactionType === "withdrawal" || data.transactionType === "fee") {
      // Credit: Bank Account (Asset decreases)
      lineItems.push({
        accountId: data.bankAccountGLId,
        description: data.description,
        debit: 0,
        credit: data.amount,
      });
      // Debit: Expense Account
      lineItems.push({
        accountId: contraAccountId,
        description: data.description,
        debit: data.amount,
        credit: 0,
      });
    } else if (data.transactionType === "transfer") {
      // For transfers, contra account should be provided separately
      // This is handled in the transfer action
      return { success: false, message: "Transfers handled separately" };
    }

    // Create journal entry
    const journalEntry = await JournalEntry.create({
      organizationId,
      entryNumber,
      entryDate: data.transactionDate,
      entryType: "automated",
      referenceType: "other",
      referenceId: data.transactionId,
      referenceNumber: data.transactionNumber,
      description: `${data.description} - ${data.transactionNumber}`,
      lineItems,
      totalDebit: data.amount,
      totalCredit: data.amount,
      isBalanced: true,
      status: "posted",
      postedDate: new Date(),
      postedBy: userId,
      createdBy: userId,
    });

    // Update GL account balances
    for (const line of lineItems) {
      const account = await Account.findById(line.accountId);
      if (account) {
        if (line.debit > 0) {
          account.debitBalance += line.debit;
          account.currentBalance = account.debitBalance - account.creditBalance;
        } else {
          account.creditBalance += line.credit;
          account.currentBalance = account.debitBalance - account.creditBalance;
        }
        await account.save();
      }
    }

    return { success: true, data: journalEntry };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function getContraAccount(
  organizationId: string,
  transactionType: string,
  category?: string
): Promise<string> {
  // Try to find account by category first
  if (category) {
    const account = await Account.findOne({
      organizationId,
      accountName: { $regex: new RegExp(category, "i") },
      del_flag: false,
    });
    if (account) return String(account._id);
  }

  // Default accounts based on transaction type
  const defaultAccounts: any = {
    deposit: { type: "revenue", subType: "sales" },
    interest: { type: "revenue", subType: "interest_income" },
    withdrawal: { type: "expense", subType: "general" },
    fee: { type: "expense", subType: "bank_charges" },
  };

  const defaults = defaultAccounts[transactionType];
  if (defaults) {
    const account = await Account.findOne({
      organizationId,
      accountType: defaults.type,
      accountSubType: defaults.subType,
      del_flag: false,
    });
    if (account) return String(account._id);
  }

  // Fallback: find any revenue or expense account
  const fallbackType = transactionType === "deposit" || transactionType === "interest" ? "revenue" : "expense";
  const fallbackAccount = await Account.findOne({
    organizationId,
    accountType: fallbackType,
    del_flag: false,
  });

  if (fallbackAccount) return String(fallbackAccount._id);

  throw new Error(`No suitable GL account found for ${transactionType}`);
}

export async function createJournalEntryForTransfer(
  organizationId: string,
  userId: string,
  data: {
    transferId: string;
    transferNumber: string;
    transferDate: Date;
    fromAccountGLId: string;
    toAccountGLId: string;
    amount: number;
    description: string;
  }
) {
  try {
    const lastEntry = await JournalEntry.findOne({ organizationId })
      .sort({ createdAt: -1 })
      .select("entryNumber");

    let nextNumber = 1;
    if (lastEntry?.entryNumber) {
      const lastNum = parseInt(lastEntry.entryNumber.split("-")[1]);
      nextNumber = lastNum + 1;
    }

    const entryNumber = `JE-${String(nextNumber).padStart(6, "0")}`;

    const lineItems: JournalEntryLineItem[] = [
      {
        accountId: data.toAccountGLId,
        description: data.description,
        debit: data.amount,
        credit: 0,
      },
      {
        accountId: data.fromAccountGLId,
        description: data.description,
        debit: 0,
        credit: data.amount,
      },
    ];

    const journalEntry = await JournalEntry.create({
      organizationId,
      entryNumber,
      entryDate: data.transferDate,
      entryType: "automated",
      referenceType: "other",
      referenceId: data.transferId,
      referenceNumber: data.transferNumber,
      description: `${data.description} - ${data.transferNumber}`,
      lineItems,
      totalDebit: data.amount,
      totalCredit: data.amount,
      isBalanced: true,
      status: "posted",
      postedDate: new Date(),
      postedBy: userId,
      createdBy: userId,
    });

    // Update GL account balances
    for (const line of lineItems) {
      const account = await Account.findById(line.accountId);
      if (account) {
        if (line.debit > 0) {
          account.debitBalance += line.debit;
        } else {
          account.creditBalance += line.credit;
        }
        account.currentBalance = account.debitBalance - account.creditBalance;
        await account.save();
      }
    }

    return { success: true, data: journalEntry };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
