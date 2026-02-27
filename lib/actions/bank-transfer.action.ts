"use server";

import { connectToDB } from "../connection/mongoose";
import BankTransfer from "../models/bank-transfer.model";
import BankAccount from "../models/bank-account.model";
import BankTransaction from "../models/bank-transaction.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";
import { checkPermission } from "../helpers/check-permission";
import { createJournalEntryForTransfer } from "../helpers/journal-entry-helper";

async function _createBankTransfer(
  user: any,
  data: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    transferDate: Date;
    notes?: string;
  }
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    if (!await checkPermission("bankTransfers_create")) {
      return { success: false, error: "Permission denied" };
    }
    
    await connectToDB();

    if (data.fromAccountId === data.toAccountId) {
      return { error: "Cannot transfer to the same account" };
    }

    const fromAccount = await BankAccount.findOne({
      _id: data.fromAccountId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    const toAccount = await BankAccount.findOne({
      _id: data.toAccountId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!fromAccount || !toAccount) {
      return { error: "Invalid bank accounts" };
    }

    if (fromAccount.currentBalance < data.amount) {
      return { error: "Insufficient balance in source account" };
    }

    const lastTransfer = await BankTransfer.findOne({ organizationId: user.organizationId })
      .sort({ createdAt: -1 })
      .select("transferNumber");

    let nextNumber = 1;
    if (lastTransfer?.transferNumber) {
      const lastNumber = parseInt(lastTransfer.transferNumber.split("-")[1]);
      nextNumber = lastNumber + 1;
    }

    const transferNumber = `TRF-${String(nextNumber).padStart(6, "0")}`;

    // Create withdrawal transaction
    const lastTransaction = await BankTransaction.findOne({ organizationId: user.organizationId })
      .sort({ createdAt: -1 })
      .select("transactionNumber");

    let nextTxNumber = 1;
    if (lastTransaction?.transactionNumber) {
      const lastNum = parseInt(lastTransaction.transactionNumber.split("-")[1]);
      nextTxNumber = lastNum + 1;
    }

    const withdrawalTx = await BankTransaction.create({
      organizationId: user.organizationId,
      bankAccountId: data.fromAccountId,
      transactionNumber: `BTX-${String(nextTxNumber).padStart(6, "0")}`,
      transactionDate: data.transferDate,
      transactionType: "transfer",
      amount: data.amount,
      description: `Transfer to ${toAccount.accountName}`,
      notes: data.notes,
      createdBy: user._id,
    });

    // Create deposit transaction
    const depositTx = await BankTransaction.create({
      organizationId: user.organizationId,
      bankAccountId: data.toAccountId,
      transactionNumber: `BTX-${String(nextTxNumber + 1).padStart(6, "0")}`,
      transactionDate: data.transferDate,
      transactionType: "transfer",
      amount: data.amount,
      description: `Transfer from ${fromAccount.accountName}`,
      notes: data.notes,
      createdBy: user._id,
    });

    // Create transfer record
    const transfer = await BankTransfer.create({
      organizationId: user.organizationId,
      transferNumber,
      ...data,
      fromTransactionId: withdrawalTx._id,
      toTransactionId: depositTx._id,
      status: "completed",
      createdBy: user._id,
    });

    // Update account balances
    fromAccount.currentBalance -= data.amount;
    await fromAccount.save();

    toAccount.currentBalance += data.amount;
    await toAccount.save();

    // Create journal entry if both accounts linked to GL
    if (fromAccount.accountId && toAccount.accountId) {
      const jeResult = await createJournalEntryForTransfer(
        String(user.organizationId),
        String(user._id),
        {
          transferId: String(transfer._id),
          transferNumber,
          transferDate: data.transferDate,
          fromAccountGLId: String(fromAccount.accountId),
          toAccountGLId: String(toAccount.accountId),
          amount: data.amount,
          description: `Transfer from ${fromAccount.accountName} to ${toAccount.accountName}`,
        }
      );

      if (jeResult.success) {
        // Link journal entry to both transactions
        if (jeResult.data) {
          await BankTransaction.findByIdAndUpdate(withdrawalTx._id, {
            journalEntryId: jeResult.data._id,
          });
          await BankTransaction.findByIdAndUpdate(depositTx._id, {
            journalEntryId: jeResult.data._id,
          });
        }
      }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "bank_transfer",
      resourceId: String(transfer._id),
      details: { after: transfer },
    });

    return { success: true, data: JSON.parse(JSON.stringify(transfer)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getBankTransfers(user: any) {
  try {
    await connectToDB();

    const transfers = await BankTransfer.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("fromAccountId", "accountName bankName")
      .populate("toAccountId", "accountName bankName")
      .sort({ transferDate: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(transfers)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getBankTransferById(user: any, id: string) {
  try {
    await connectToDB();

    const transfer = await BankTransfer.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("fromAccountId", "accountName bankName")
      .populate("toAccountId", "accountName bankName");

    if (!transfer) return { error: "Bank transfer not found" };

    return { success: true, data: JSON.parse(JSON.stringify(transfer)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteBankTransfer(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    if (!await checkPermission("bankTransfers_create")) {
      return { success: false, error: "Permission denied" };
    }
    
    await connectToDB();

    const transfer = await BankTransfer.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!transfer) return { error: "Bank transfer not found" };

    // Reverse the account balances
    const fromAccount = await BankAccount.findById(transfer.fromAccountId);
    const toAccount = await BankAccount.findById(transfer.toAccountId);

    if (fromAccount) {
      fromAccount.currentBalance += transfer.amount;
      await fromAccount.save();
    }

    if (toAccount) {
      toAccount.currentBalance -= transfer.amount;
      await toAccount.save();
    }

    // Mark transactions as deleted
    if (transfer.fromTransactionId) {
      await BankTransaction.findByIdAndUpdate(transfer.fromTransactionId, { del_flag: true });
    }
    if (transfer.toTransactionId) {
      await BankTransaction.findByIdAndUpdate(transfer.toTransactionId, { del_flag: true });
    }

    // Mark transfer as deleted
    await BankTransfer.findByIdAndUpdate(id, { del_flag: true, deletedBy: user._id });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "bank_transfer",
      resourceId: String(id),
      details: { before: transfer },
    });

    return { success: true, message: "Bank transfer deleted successfully" };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createBankTransfer = await withAuth(_createBankTransfer);
export const getBankTransfers = await withAuth(_getBankTransfers);
export const getBankTransferById = await withAuth(_getBankTransferById);
export const deleteBankTransfer = await withAuth(_deleteBankTransfer);
