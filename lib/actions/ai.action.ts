"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import AIInsight from "@/lib/models/ai-insight.model";
import Invoice from "@/lib/models/invoice.model";
import Expense from "@/lib/models/expense.model";
import BankTransaction from "@/lib/models/bank-transaction.model";
import { withAuth } from "@/lib/helpers/auth";
import { checkPermission } from "@/lib/helpers/check-permission";

async function _getAIInsights(user: any) {
  // const hasPermission = await checkPermission("aiAssistant_view");
  // if (!hasPermission) throw new Error("Permission denied");

  await connectToDB();

  const insights = await AIInsight.find({
    organizationId: user.organizationId,
    del_flag: false
  }).sort({ createdAt: -1 }).limit(50).lean();

  const newInsights = insights.filter((i: any) => i.status === "new").length;
  const criticalInsights = insights.filter((i: any) => i.severity === "critical").length;
  const totalImpact = insights.reduce((sum: number, i: any) => sum + (i.impact || 0), 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const [invoices, expenses, transactions] = await Promise.all([
    Invoice.find({ organizationId: user.organizationId, del_flag: false, createdAt: { $gte: thirtyDaysAgo } }).lean(),
    Expense.find({ organizationId: user.organizationId, del_flag: false, createdAt: { $gte: thirtyDaysAgo } }).lean(),
    BankTransaction.find({ organizationId: user.organizationId, del_flag: false, date: { $gte: thirtyDaysAgo } }).lean()
  ]);

  const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + inv.totalAmount, 0);
  const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
  const cashFlow = totalRevenue - totalExpenses;
  
  const healthScore = Math.min(100, Math.max(0, 50 + (cashFlow / 1000)));

  return JSON.parse(JSON.stringify({
    insights,
    summary: { newInsights, criticalInsights, totalImpact, healthScore: Math.round(healthScore) },
    metrics: { totalRevenue, totalExpenses, cashFlow, transactionCount: transactions.length }
  }));
}

export const getAIInsights = await withAuth(_getAIInsights);
