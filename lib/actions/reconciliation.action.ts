"use server";

import { connectToDB } from "../connection/mongoose";
import Account from "../models/account.model";
import GeneralLedger from "../models/general-ledger.model";
import JournalEntry from "../models/journal-entry.model";
import { withAuth } from "../helpers/auth";
import { checkPermission } from "../helpers/check-permission";
import { revalidatePath } from "next/cache";

async function _getReconciliationReport(user: any) {
  try {
    const hasPermission = await checkPermission("reports_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view reconciliation reports" };
    }

    await connectToDB();

    const issues = [];

    // 1. Check trial balance
    const accounts = await Account.find({
      organizationId: user.organizationId,
      del_flag: false,
      isActive: true,
    });

    const trialBalance = accounts.map((account) => {
      let debit = 0;
      let credit = 0;
      
      if (["asset", "expense"].includes(account.accountType)) {
        if (account.currentBalance > 0) {
          debit = account.currentBalance;
        } else if (account.currentBalance < 0) {
          credit = Math.abs(account.currentBalance);
        }
      } else {
        if (account.currentBalance > 0) {
          credit = account.currentBalance;
        } else if (account.currentBalance < 0) {
          debit = Math.abs(account.currentBalance);
        }
      }
      
      return {
        accountType: account.accountType,
        currentBalance: account.currentBalance,
        debit,
        credit
      };
    });

    const totalDebit = trialBalance.reduce((sum, acc) => sum + acc.debit, 0);
    const totalCredit = trialBalance.reduce((sum, acc) => sum + acc.credit, 0);
    const difference = totalDebit - totalCredit;

    if (Math.abs(difference) >= 0.01) {
      issues.push({
        type: "trial_balance_unbalanced",
        severity: "high",
        description: "Trial Balance is not balanced",
        details: {
          totalDebit,
          totalCredit,
          difference
        }
      });
    }

    // 2. Check for unbalanced journal entries
    const journalEntries = await JournalEntry.find({
      organizationId: user.organizationId,
      del_flag: false,
      status: "posted"
    });

    for (const entry of journalEntries) {
      if (Math.abs(entry.totalDebit - entry.totalCredit) > 0.01) {
        issues.push({
          type: "unbalanced_entry",
          severity: "high",
          description: `Journal Entry ${entry.entryNumber} is unbalanced`,
          details: {
            entryNumber: entry.entryNumber,
            entryId: String(entry._id),
            totalDebit: entry.totalDebit,
            totalCredit: entry.totalCredit,
            difference: entry.totalDebit - entry.totalCredit
          }
        });
      }
    }

    // 3. Verify account balances match GL transactions
    for (const account of accounts) {
      const glEntries = await GeneralLedger.find({
        organizationId: user.organizationId,
        accountId: account._id,
        del_flag: false
      });

      const calculatedDebit = glEntries.reduce((sum, e) => sum + (e.debit || 0), 0);
      const calculatedCredit = glEntries.reduce((sum, e) => sum + (e.credit || 0), 0);

      if (Math.abs(account.debitBalance - calculatedDebit) > 0.01 || 
          Math.abs(account.creditBalance - calculatedCredit) > 0.01) {
        issues.push({
          type: "balance_mismatch",
          severity: "medium",
          description: `Account ${account.accountName} balance doesn't match GL`,
          details: {
            accountId: String(account._id),
            accountName: account.accountName,
            accountCode: account.accountCode,
            recordedDebit: account.debitBalance,
            calculatedDebit,
            recordedCredit: account.creditBalance,
            calculatedCredit
          }
        });
      }
    }

    // 4. Check for orphaned GL entries
    const glEntries = await GeneralLedger.find({
      organizationId: user.organizationId,
      del_flag: false
    });

    for (const glEntry of glEntries) {
      if (glEntry.journalEntryId) {
        const journalExists = await JournalEntry.exists({
          _id: glEntry.journalEntryId,
          del_flag: false
        });

        if (!journalExists) {
          issues.push({
            type: "orphaned_entry",
            severity: "low",
            description: `GL entry references non-existent journal entry`,
            details: {
              glEntryId: String(glEntry._id),
              journalEntryId: String(glEntry.journalEntryId),
              description: glEntry.description
            }
          });
        }
      }
    }

    return {
      success: true,
      data: {
        totalIssues: issues.length,
        issues,
        isHealthy: issues.length === 0
      }
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _recalculateAccountBalances(user: any, path: string) {
  try {
    await connectToDB();

    // First, verify GL is balanced
    const allGLEntries = await GeneralLedger.find({
      organizationId: user.organizationId,
      del_flag: false
    });

    const totalGLDebit = allGLEntries.reduce((sum, e) => sum + (e.debit || 0), 0);
    const totalGLCredit = allGLEntries.reduce((sum, e) => sum + (e.credit || 0), 0);

    if (Math.abs(totalGLDebit - totalGLCredit) > 0.01) {
      return {
        error: `General Ledger is unbalanced. Total GL Debits: ${totalGLDebit.toFixed(2)}, Total GL Credits: ${totalGLCredit.toFixed(2)}. Difference: ${(totalGLDebit - totalGLCredit).toFixed(2)}. This indicates corrupted journal entries that must be manually reviewed.`
      };
    }

    const accounts = await Account.find({
      organizationId: user.organizationId,
      del_flag: false
    });

    let updatedCount = 0;

    for (const account of accounts) {
      const glEntries = await GeneralLedger.find({
        organizationId: user.organizationId,
        accountId: account._id,
        del_flag: false
      });

      const calculatedDebit = glEntries.reduce((sum, e) => sum + (e.debit || 0), 0);
      const calculatedCredit = glEntries.reduce((sum, e) => sum + (e.credit || 0), 0);

      let calculatedBalance = 0;
      if (["asset", "expense"].includes(account.accountType)) {
        calculatedBalance = calculatedDebit - calculatedCredit;
      } else {
        calculatedBalance = calculatedCredit - calculatedDebit;
      }

      account.debitBalance = calculatedDebit;
      account.creditBalance = calculatedCredit;
      account.currentBalance = calculatedBalance;
      await account.save();
      updatedCount++;
    }

    revalidatePath(path);
    
    return {
      success: true,
      data: {
        message: `Recalculated ${updatedCount} accounts. GL is balanced (Debits: ${totalGLDebit.toFixed(2)}, Credits: ${totalGLCredit.toFixed(2)})`,
        updatedCount
      }
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getReconciliationReport = await withAuth(_getReconciliationReport);
export const recalculateAccountBalances = await withAuth(_recalculateAccountBalances);
