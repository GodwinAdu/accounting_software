"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Budget from "@/lib/models/budget.model";
import Department from "@/lib/models/deparment.model";
import Invoice from "@/lib/models/invoice.model";
import Expense from "@/lib/models/expense.model";
import { withAuth } from "@/lib/helpers/auth";
import { checkPermission } from "@/lib/helpers/check-permission";

async function _getAnnualBudgets(user: any) {
  const hasPermission = await checkPermission("annualBudget_view");
  if (!hasPermission) throw new Error("Permission denied");

  await connectToDB();
  
  const currentYear = new Date().getFullYear();
  const budgets = await Budget.find({ 
    organizationId: user.organizationId, 
    del_flag: false,
    type: "annual",
    fiscalYear: currentYear
  }).sort({ createdAt: -1 }).lean();

  const totalBudgeted = budgets.reduce((sum: number, b: any) => sum + b.totalBudgeted, 0);
  const totalActual = budgets.reduce((sum: number, b: any) => sum + b.totalActual, 0);
  const totalVariance = totalBudgeted - totalActual;
  const activeBudgets = budgets.filter((b: any) => b.status === "active").length;

  return JSON.parse(JSON.stringify({
    budgets,
    summary: { totalBudgeted, totalActual, totalVariance, activeBudgets }
  }));
}

export const getAnnualBudgets = await withAuth(_getAnnualBudgets);

async function _getDepartmentBudgets(user: any) {
  const hasPermission = await checkPermission("departmentBudgets_view");
  if (!hasPermission) throw new Error("Permission denied");

  await connectToDB();
  
  const [budgets, departments] = await Promise.all([
    Budget.find({ 
      organizationId: user.organizationId, 
      del_flag: false,
      type: "department"
    }).sort({ createdAt: -1 }).lean(),
    Department.find({ 
      organizationId: user.organizationId, 
      del_flag: false 
    }).lean()
  ]);

  const totalAllocated = budgets.reduce((sum: number, b: any) => sum + b.totalBudgeted, 0);
  const totalSpent = budgets.reduce((sum: number, b: any) => sum + b.totalActual, 0);
  const overBudget = budgets.filter((b: any) => b.totalActual > b.totalBudgeted).length;

  return JSON.parse(JSON.stringify({
    budgets,
    departments,
    summary: { totalDepartments: departments.length, totalAllocated, totalSpent, overBudget }
  }));
}

export const getDepartmentBudgets = await withAuth(_getDepartmentBudgets);

async function _getBudgetForecasting(user: any) {
  const hasPermission = await checkPermission("forecasting_view");
  if (!hasPermission) throw new Error("Permission denied");

  await connectToDB();
  
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const [invoices, expenses] = await Promise.all([
    Invoice.find({ 
      organizationId: user.organizationId, 
      del_flag: false,
      createdAt: { $gte: threeMonthsAgo }
    }).lean(),
    Expense.find({ 
      organizationId: user.organizationId, 
      del_flag: false,
      createdAt: { $gte: threeMonthsAgo }
    }).lean()
  ]);

  const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + inv.total, 0);
  const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
  const avgMonthlyRevenue = totalRevenue / 3;
  const avgMonthlyExpenses = totalExpenses / 3;

  const projectedRevenue = avgMonthlyRevenue * 12;
  const projectedExpenses = avgMonthlyExpenses * 12;
  const projectedProfit = projectedRevenue - projectedExpenses;

  const scenarios = [
    {
      name: "Conservative",
      revenue: projectedRevenue * 0.9,
      expenses: projectedExpenses * 1.1,
      profit: (projectedRevenue * 0.9) - (projectedExpenses * 1.1)
    },
    {
      name: "Base",
      revenue: projectedRevenue,
      expenses: projectedExpenses,
      profit: projectedProfit
    },
    {
      name: "Optimistic",
      revenue: projectedRevenue * 1.2,
      expenses: projectedExpenses * 0.95,
      profit: (projectedRevenue * 1.2) - (projectedExpenses * 0.95)
    }
  ];

  return JSON.parse(JSON.stringify({
    summary: { projectedRevenue, projectedExpenses, projectedProfit, avgMonthlyRevenue },
    scenarios
  }));
}

export const getBudgetForecasting = await withAuth(_getBudgetForecasting);

async function _getBudgetVariance(user: any) {
  const hasPermission = await checkPermission("budgetVariance_view");
  if (!hasPermission) throw new Error("Permission denied");

  await connectToDB();
  
  const budgets = await Budget.find({ 
    organizationId: user.organizationId, 
    del_flag: false,
    status: "active"
  }).sort({ createdAt: -1 }).lean();

  const totalVariance = budgets.reduce((sum: number, b: any) => sum + b.totalVariance, 0);
  const favorable = budgets.filter((b: any) => b.totalVariance >= 0).reduce((sum: number, b: any) => sum + b.totalVariance, 0);
  const unfavorable = budgets.filter((b: any) => b.totalVariance < 0).reduce((sum: number, b: any) => sum + Math.abs(b.totalVariance), 0);
  const totalBudgeted = budgets.reduce((sum: number, b: any) => sum + b.totalBudgeted, 0);
  const variancePercent = totalBudgeted > 0 ? ((totalVariance / totalBudgeted) * 100).toFixed(1) : "0.0";

  return JSON.parse(JSON.stringify({
    budgets,
    summary: { totalVariance, favorable, unfavorable, variancePercent }
  }));
}

export const getBudgetVariance = await withAuth(_getBudgetVariance);
