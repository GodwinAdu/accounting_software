"use server";

import { connectToDB } from "../connection/mongoose";
import BankReconciliation from "../models/bank-reconciliation.model";
import BankTransaction from "../models/bank-transaction.model";
import BankAccount from "../models/bank-account.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createBankReconciliation(
  user: any,
  data: {
    bankAccountId: string;
    statementDate: Date;
    statementBalance: number;
  }
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const lastReconciliation = await BankReconciliation.findOne({ organizationId: user.organizationId })
      .sort({ createdAt: -1 })
      .select("reconciliationNumber");

    let nextNumber = 1;
    if (lastReconciliation?.reconciliationNumber) {
      const lastNumber = parseInt(lastReconciliation.reconciliationNumber.split("-")[1]);
      nextNumber = lastNumber + 1;
    }

    const reconciliationNumber = `REC-${String(nextNumber).padStart(6, "0")}`;

    const bankAccount = await BankAccount.findById(data.bankAccountId);
    const bookBalance = bankAccount?.currentBalance || 0;
    const difference = data.statementBalance - bookBalance;

    const reconciliation = await BankReconciliation.create({
      organizationId: user.organizationId,
      reconciliationNumber,
      reconciliationDate: new Date(),
      bookBalance,
      difference,
      ...data,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "bank_reconciliation",
      resourceId: String(reconciliation._id),
      details: { after: reconciliation },
    });

    return { success: true, data: JSON.parse(JSON.stringify(reconciliation)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getBankReconciliations(user: any, bankAccountId?: string) {
  try {
    await connectToDB();

    const query: any = {
      organizationId: user.organizationId,
      del_flag: false,
    };

    if (bankAccountId) {
      query.bankAccountId = bankAccountId;
    }

    const reconciliations = await BankReconciliation.find(query)
      .populate("bankAccountId", "accountName bankName")
      .sort({ reconciliationDate: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(reconciliations)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _completeBankReconciliation(user: any, id: string, reconciledTransactionIds: string[]) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const reconciliation = await BankReconciliation.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      {
        status: "completed",
        reconciledTransactions: reconciledTransactionIds,
        modifiedBy: user._id,
        $inc: { mod_flag: 1 },
      },
      { new: true }
    );

    if (!reconciliation) return { error: "Reconciliation not found" };

    // Mark transactions as reconciled
    await BankTransaction.updateMany(
      { _id: { $in: reconciledTransactionIds } },
      { isReconciled: true, reconciledDate: new Date() }
    );

    // Update bank account last reconciled date
    await BankAccount.findByIdAndUpdate(reconciliation.bankAccountId, {
      lastReconciledDate: reconciliation.statementDate,
      lastReconciledBalance: reconciliation.statementBalance,
    });

    return { success: true, data: JSON.parse(JSON.stringify(reconciliation)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getUnreconciledTransactions(user: any, bankAccountId: string) {
  try {
    await connectToDB();

    const transactions = await BankTransaction.find({
      organizationId: user.organizationId,
      bankAccountId,
      isReconciled: false,
      del_flag: false,
    }).sort({ transactionDate: 1 });

    return { success: true, data: JSON.parse(JSON.stringify(transactions)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createBankReconciliation = await withAuth(_createBankReconciliation);
export const getBankReconciliations = await withAuth(_getBankReconciliations);
export const completeBankReconciliation = await withAuth(_completeBankReconciliation);
export const getUnreconciledTransactions = await withAuth(_getUnreconciledTransactions);
