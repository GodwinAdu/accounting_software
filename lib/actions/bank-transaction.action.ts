"use server";

import { connectToDB } from "../connection/mongoose";
import BankTransaction from "../models/bank-transaction.model";
import BankAccount from "../models/bank-account.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";
import { checkPermission } from "../helpers/check-permission";
import { createJournalEntryForBankTransaction } from "../helpers/journal-entry-helper";

async function _createBankTransaction(
  user: any,
  data: {
    bankAccountId: string;
    transactionDate: Date;
    transactionType: "deposit" | "withdrawal" | "transfer" | "fee" | "interest" | "other";
    amount: number;
    description: string;
    payee?: string;
    referenceNumber?: string;
    checkNumber?: string;
    category?: string;
    notes?: string;
  }
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    if (!await checkPermission("transactions_create")) {
      return { success: false, error: "Permission denied" };
    }
    
    await connectToDB();

    const lastTransaction = await BankTransaction.findOne({ organizationId: user.organizationId })
      .sort({ createdAt: -1 })
      .select("transactionNumber");

    let nextNumber = 1;
    if (lastTransaction?.transactionNumber) {
      const lastNumber = parseInt(lastTransaction.transactionNumber.split("-")[1]);
      nextNumber = lastNumber + 1;
    }

    const transactionNumber = `BTX-${String(nextNumber).padStart(6, "0")}`;

    const transaction = await BankTransaction.create({
      organizationId: user.organizationId,
      transactionNumber,
      ...data,
      createdBy: user._id,
    });

    // Update bank account balance
    const bankAccount = await BankAccount.findById(data.bankAccountId);
    if (bankAccount) {
      if (data.transactionType === "deposit" || data.transactionType === "interest") {
        bankAccount.currentBalance += data.amount;
      } else {
        bankAccount.currentBalance -= data.amount;
      }
      await bankAccount.save();

      // Create journal entry if bank account is linked to GL
      if (bankAccount.accountId && data.transactionType !== "transfer") {
        const jeResult = await createJournalEntryForBankTransaction(
          String(user.organizationId),
          String(user._id),
          {
            transactionId: String(transaction._id),
            transactionNumber,
            transactionDate: data.transactionDate,
            description: data.description,
            bankAccountGLId: String(bankAccount.accountId),
            amount: data.amount,
            transactionType: data.transactionType,
            category: data.category,
          }
        );

        if (jeResult.success && jeResult.data) {
          transaction.journalEntryId = jeResult.data._id;
          await transaction.save();
        }
      }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "bank_transaction",
      resourceId: String(transaction._id),
      details: { after: transaction },
    });

    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getBankTransactions(user: any, bankAccountId?: string) {
  try {
    await connectToDB();

    const query: any = {
      organizationId: user.organizationId,
      del_flag: false,
    };

    if (bankAccountId) {
      query.bankAccountId = bankAccountId;
    }

    const transactions = await BankTransaction.find(query)
      .populate("bankAccountId", "accountName bankName")
      .populate("journalEntryId", "entryNumber")
      .sort({ transactionDate: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(transactions)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getBankTransactionById(user: any, id: string) {
  try {
    await connectToDB();

    const transaction = await BankTransaction.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("bankAccountId", "accountName bankName")
      .populate("journalEntryId", "entryNumber");

    if (!transaction) return { error: "Bank transaction not found" };

    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateBankTransaction(
  user: any,
  id: string,
  data: {
    transactionDate?: Date;
    transactionType?: "deposit" | "withdrawal" | "transfer" | "fee" | "interest" | "other";
    amount?: number;
    description?: string;
    payee?: string;
    referenceNumber?: string;
    checkNumber?: string;
    category?: string;
    notes?: string;
  }
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    if (!await checkPermission("transactions_update")) {
      return { success: false, error: "Permission denied" };
    }
    
    await connectToDB();

    const oldTransaction = await BankTransaction.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!oldTransaction) return { error: "Bank transaction not found" };

    const transaction = await BankTransaction.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, $inc: { mod_flag: 1 } },
      { new: true }
    );

    if (!transaction) return { error: "Bank transaction not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "bank_transaction",
      resourceId: String(id),
      details: { before: oldTransaction, after: transaction },
    });

    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteBankTransaction(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    if (!await checkPermission("transactions_delete")) {
      return { success: false, error: "Permission denied" };
    }
    
    await connectToDB();

    const transaction = await BankTransaction.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!transaction) return { error: "Bank transaction not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "bank_transaction",
      resourceId: String(id),
      details: { before: transaction },
    });

    return { success: true, message: "Bank transaction deleted successfully" };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _reconcileBankTransaction(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const transaction = await BankTransaction.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { isReconciled: true, reconciledDate: new Date(), modifiedBy: user._id, $inc: { mod_flag: 1 } },
      { new: true }
    );

    if (!transaction) return { error: "Bank transaction not found" };

    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createBankTransaction = await withAuth(_createBankTransaction);
export const getBankTransactions = await withAuth(_getBankTransactions);
export const getBankTransactionById = await withAuth(_getBankTransactionById);
export const updateBankTransaction = await withAuth(_updateBankTransaction);
export const deleteBankTransaction = await withAuth(_deleteBankTransaction);
export const reconcileBankTransaction = await withAuth(_reconcileBankTransaction);
