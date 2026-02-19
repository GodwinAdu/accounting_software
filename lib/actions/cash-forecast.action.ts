"use server";

import BankTransaction from "@/lib/models/bank-transaction.model";
import Invoice from "@/lib/models/invoice.model";
import Bill from "@/lib/models/bill.model";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { checkPermission } from "@/lib/helpers/check-permission";

async function _getCashForecast(user: User) {
  try {
    const hasPermission = await checkPermission("cashForecast_view");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();

    // Get current balance from bank accounts
    const BankAccount = (await import("@/lib/models/bank-account.model")).default;
    const accounts = await BankAccount.find({ organizationId: user.organizationId, del_flag: false, status: "active" });
    const currentBalance = accounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);

    // Get historical transactions (last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const transactions = await BankTransaction.find({
      organizationId: user.organizationId,
      del_flag: false,
      date: { $gte: ninetyDaysAgo },
    });

    // Calculate average daily inflow and outflow
    const inflows = transactions.filter(t => t.type === "credit");
    const outflows = transactions.filter(t => t.type === "debit");
    
    const avgDailyInflow = inflows.reduce((sum, t) => sum + t.amount, 0) / 90;
    const avgDailyOutflow = outflows.reduce((sum, t) => sum + t.amount, 0) / 90;

    // Get pending invoices (expected inflows)
    const pendingInvoices = await Invoice.find({
      organizationId: user.organizationId,
      del_flag: false,
      status: { $in: ["sent", "overdue"] },
    });
    const expectedInflows = pendingInvoices.reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);

    // Get pending bills (expected outflows)
    const pendingBills = await Bill.find({
      organizationId: user.organizationId,
      del_flag: false,
      status: { $in: ["pending", "overdue"] },
    });
    const expectedOutflows = pendingBills.reduce((sum, bill) => sum + (bill.total - bill.amountPaid), 0);

    // Calculate forecasts
    const forecast30 = currentBalance + (avgDailyInflow * 30) - (avgDailyOutflow * 30) + (expectedInflows * 0.7);
    const forecast60 = currentBalance + (avgDailyInflow * 60) - (avgDailyOutflow * 60) + (expectedInflows * 0.85);
    const forecast90 = currentBalance + (avgDailyInflow * 90) - (avgDailyOutflow * 90) + expectedInflows - (expectedOutflows * 0.8);

    // Weekly projections
    const projections = [];
    let runningBalance = currentBalance;
    
    for (let week = 1; week <= 4; week++) {
      const weeklyInflow = avgDailyInflow * 7;
      const weeklyOutflow = avgDailyOutflow * 7;
      runningBalance = runningBalance + weeklyInflow - weeklyOutflow;
      
      projections.push({
        period: `Week ${week}`,
        inflow: Math.round(weeklyInflow),
        outflow: Math.round(weeklyOutflow),
        balance: Math.round(runningBalance),
        status: runningBalance > currentBalance * 0.5 ? "healthy" : "warning",
      });
    }

    return {
      success: true,
      data: {
        currentBalance: Math.round(currentBalance),
        forecast30: Math.round(forecast30),
        forecast60: Math.round(forecast60),
        forecast90: Math.round(forecast90),
        projections,
        avgDailyInflow: Math.round(avgDailyInflow),
        avgDailyOutflow: Math.round(avgDailyOutflow),
        expectedInflows: Math.round(expectedInflows),
        expectedOutflows: Math.round(expectedOutflows),
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getCashForecast = await withAuth(_getCashForecast);
