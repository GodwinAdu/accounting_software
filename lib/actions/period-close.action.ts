"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import BankReconciliation from "../models/bank-reconciliation.model";
import BankTransaction from "../models/bank-transaction.model";
import JournalEntry from "../models/journal-entry.model";
import BankAccount from "../models/bank-account.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _getPeriodCloseData(user: any) {
  try {
    await connectToDB();

    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const bankAccounts = await BankAccount.find({ 
      organizationId: user.organizationId, 
      del_flag: false 
    }).lean();

    const reconciliations = await BankReconciliation.find({ 
      organizationId: user.organizationId, 
      del_flag: false,
      status: "completed"
    }).lean();

    const unreconciledTransactions = await BankTransaction.find({ 
      organizationId: user.organizationId, 
      del_flag: false,
      reconciled: false,
      transactionDate: { $lt: currentDate }
    }).lean();

    const draftJournalEntries = await JournalEntry.find({ 
      organizationId: user.organizationId, 
      del_flag: false,
      status: "draft",
      entryDate: { $gte: firstDayOfMonth, $lt: currentDate }
    }).lean();

    const postedJournalEntries = await JournalEntry.find({ 
      organizationId: user.organizationId, 
      del_flag: false,
      status: "posted",
      entryDate: { $gte: firstDayOfMonth, $lt: currentDate }
    }).lean();

    const reconciledAccounts = reconciliations.filter(r => 
      new Date(r.reconciliationDate) >= firstDayOfMonth
    ).length;

    const tasks = [
      {
        title: "Reconcile all bank accounts",
        description: `${reconciledAccounts} of ${bankAccounts.length} accounts reconciled`,
        completed: reconciledAccounts === bankAccounts.length && bankAccounts.length > 0
      },
      {
        title: "Review unreconciled transactions",
        description: `${unreconciledTransactions.length} unmatched transactions`,
        completed: unreconciledTransactions.length === 0
      },
      {
        title: "Post all journal entries",
        description: `${draftJournalEntries.length} draft entries remaining`,
        completed: draftJournalEntries.length === 0
      },
      {
        title: "Run financial reports",
        description: "Generate P&L and Balance Sheet",
        completed: false
      },
      {
        title: "Review adjusting entries",
        description: "Check all period-end adjustments",
        completed: false
      }
    ];

    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = tasks.length - completedTasks;

    return {
      success: true,
      data: {
        tasks,
        completedTasks,
        pendingTasks,
        canClose: completedTasks === tasks.length,
        postedEntriesCount: postedJournalEntries.length,
        reconciledAccountsCount: reconciledAccounts,
        unreconciledCount: unreconciledTransactions.length,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _closePeriod(user: any, period: string, pathname: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    // Verify all tasks are complete
    const checkResult = await _getPeriodCloseData(user);
    if (!checkResult.success || !checkResult.data?.canClose) {
      return { error: "Cannot close period. Complete all tasks first." };
    }

    // Here you would implement the actual period close logic:
    // 1. Lock all transactions for the period
    // 2. Create closing entries
    // 3. Update period status
    // 4. Generate period reports

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "close_period",
      resource: "accounting_period",
      resourceId: period,
      details: { period },
    });

    revalidatePath(pathname);
    return { success: true, message: "Period closed successfully" };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getPeriodCloseData = await withAuth(_getPeriodCloseData);
export const closePeriod = await withAuth(_closePeriod);
