"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Budget from "@/lib/models/budget.model";
import JournalEntry from "@/lib/models/journal-entry.model";
import { withAuth } from "@/lib/helpers/auth";

async function _getBudgetVsActual(user: any, budgetId: string) {
  try {
    await connectToDB();

    const budget = await Budget.findOne({
      _id: budgetId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!budget) throw new Error("Budget not found");

    const results = await Promise.all(
      budget.lineItems.map(async (item) => {
        const journalEntries = await JournalEntry.find({
          organizationId: user.organizationId,
          "lineItems.accountId": item.accountId,
          date: { $gte: budget.startDate, $lte: budget.endDate },
          status: "posted",
          del_flag: false,
        });

        let actualAmount = 0;
        journalEntries.forEach((entry) => {
          entry.lineItems.forEach((line: any) => {
            if (line.accountId.toString() === item.accountId.toString()) {
              actualAmount += line.debit - line.credit;
            }
          });
        });

        const variance = item.budgetedAmount - Math.abs(actualAmount);
        const variancePercent = item.budgetedAmount > 0 ? (variance / item.budgetedAmount) * 100 : 0;

        return {
          accountId: item.accountId,
          accountCode: item.accountCode,
          accountName: item.accountName,
          budgeted: item.budgetedAmount,
          actual: Math.abs(actualAmount),
          variance,
          variancePercent,
          status: variance >= 0 ? "under" : "over",
        };
      })
    );

    const totalBudgeted = results.reduce((sum, r) => sum + r.budgeted, 0);
    const totalActual = results.reduce((sum, r) => sum + r.actual, 0);
    const totalVariance = totalBudgeted - totalActual;

    return {
      success: true,
      data: {
        budget: {
          budgetNumber: budget.budgetNumber,
          name: budget.name,
          fiscalYear: budget.fiscalYear,
          startDate: budget.startDate,
          endDate: budget.endDate,
        },
        summary: {
          totalBudgeted,
          totalActual,
          totalVariance,
          variancePercent: totalBudgeted > 0 ? (totalVariance / totalBudgeted) * 100 : 0,
        },
        lineItems: results,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const getBudgetVsActual = await withAuth(_getBudgetVsActual);
