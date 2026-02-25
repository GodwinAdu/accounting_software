"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Invoice from "@/lib/models/invoice.model";
import Expense from "@/lib/models/expense.model";

export async function calculateForecasting(organizationId: string) {
  await connectToDB();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [invoices, expenses] = await Promise.all([
    Invoice.find({
      organizationId,
      invoiceDate: { $gte: sixMonthsAgo },
      del_flag: false
    }).lean(),
    Expense.find({
      organizationId,
      expenseDate: { $gte: sixMonthsAgo },
      del_flag: false
    }).lean()
  ]);

  const monthlyRevenue: { [key: string]: number } = {};
  const monthlyExpenses: { [key: string]: number } = {};

  invoices.forEach((inv: any) => {
    const month = new Date(inv.invoiceDate).toISOString().slice(0, 7);
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + inv.totalAmount;
  });

  expenses.forEach((exp: any) => {
    const month = new Date(exp.expenseDate).toISOString().slice(0, 7);
    monthlyExpenses[month] = (monthlyExpenses[month] || 0) + exp.totalAmount;
  });

  const revenueValues = Object.values(monthlyRevenue);
  const expenseValues = Object.values(monthlyExpenses);

  const avgMonthlyRevenue = revenueValues.length > 0 
    ? revenueValues.reduce((a, b) => a + b, 0) / revenueValues.length 
    : 0;
  const avgMonthlyExpenses = expenseValues.length > 0 
    ? expenseValues.reduce((a, b) => a + b, 0) / expenseValues.length 
    : 0;

  const projectedRevenue = avgMonthlyRevenue * 12;
  const projectedExpenses = avgMonthlyExpenses * 12;
  const projectedProfit = projectedRevenue - projectedExpenses;

  const scenarios = [
    {
      name: 'Conservative',
      revenue: Math.round(projectedRevenue * 0.9),
      expenses: Math.round(projectedExpenses * 1.05),
      profit: Math.round((projectedRevenue * 0.9) - (projectedExpenses * 1.05))
    },
    {
      name: 'Base',
      revenue: Math.round(projectedRevenue),
      expenses: Math.round(projectedExpenses),
      profit: Math.round(projectedProfit)
    },
    {
      name: 'Optimistic',
      revenue: Math.round(projectedRevenue * 1.2),
      expenses: Math.round(projectedExpenses * 0.95),
      profit: Math.round((projectedRevenue * 1.2) - (projectedExpenses * 0.95))
    }
  ];

  return {
    summary: {
      projectedRevenue: Math.round(projectedRevenue),
      projectedExpenses: Math.round(projectedExpenses),
      projectedProfit: Math.round(projectedProfit),
      avgMonthlyRevenue: Math.round(avgMonthlyRevenue)
    },
    scenarios,
    monthlyData: {
      revenue: monthlyRevenue,
      expenses: monthlyExpenses
    }
  };
}
