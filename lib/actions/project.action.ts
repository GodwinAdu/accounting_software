"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Project from "@/lib/models/project.model";
import ProjectTime from "@/lib/models/project-time.model";
import Expense from "@/lib/models/expense.model";
import { withAuth } from "@/lib/helpers/auth";
import { checkPermission } from "@/lib/helpers/check-permission";

async function _getAllProjects(user: any) {
  const hasPermission = await checkPermission("projectsAll_view");
  if (!hasPermission) throw new Error("Permission denied");

  await connectToDB();

  const projects = await Project.find({
    organizationId: user.organizationId,
    del_flag: false
  }).populate("managerId", "name").populate("clientId", "name").sort({ createdAt: -1 }).lean();

  const totalBudget = projects.reduce((sum: number, p: any) => sum + p.budget, 0);
  const totalCost = projects.reduce((sum: number, p: any) => sum + p.actualCost, 0);
  const totalRevenue = projects.reduce((sum: number, p: any) => sum + p.revenue, 0);
  const activeProjects = projects.filter((p: any) => p.status === "active").length;

  return JSON.parse(JSON.stringify({
    projects,
    summary: { totalProjects: projects.length, totalBudget, totalCost, totalRevenue, activeProjects }
  }));
}

export const getAllProjects = await withAuth(_getAllProjects);

async function _getProjectTime(user: any) {
  const hasPermission = await checkPermission("projectTime_view");
  if (!hasPermission) throw new Error("Permission denied");

  await connectToDB();

  const timeEntries = await ProjectTime.find({
    organizationId: user.organizationId,
    del_flag: false
  }).populate("projectId", "name").populate("userId", "name").sort({ date: -1 }).lean();

  const totalHours = timeEntries.reduce((sum: number, t: any) => sum + t.hours, 0);
  const billableHours = timeEntries.filter((t: any) => t.billable).reduce((sum: number, t: any) => sum + t.hours, 0);
  const totalAmount = timeEntries.reduce((sum: number, t: any) => sum + t.amount, 0);
  const pendingApproval = timeEntries.filter((t: any) => t.status === "submitted").length;

  return JSON.parse(JSON.stringify({
    timeEntries,
    summary: { totalHours, billableHours, totalAmount, pendingApproval }
  }));
}

export const getProjectTime = await withAuth(_getProjectTime);

async function _getProjectBudgets(user: any) {
  const hasPermission = await checkPermission("projectBudgets_view");
  if (!hasPermission) throw new Error("Permission denied");

  await connectToDB();

  const projects = await Project.find({
    organizationId: user.organizationId,
    del_flag: false,
    status: { $in: ["active", "planning"] }
  }).populate("managerId", "name").sort({ createdAt: -1 }).lean();

  const totalBudget = projects.reduce((sum: number, p: any) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum: number, p: any) => sum + p.actualCost, 0);
  const remaining = totalBudget - totalSpent;
  const overBudget = projects.filter((p: any) => p.actualCost > p.budget).length;

  return JSON.parse(JSON.stringify({
    projects,
    summary: { totalBudget, totalSpent, remaining, overBudget }
  }));
}

export const getProjectBudgets = await withAuth(_getProjectBudgets);

async function _getProjectProfitability(user: any) {
  const hasPermission = await checkPermission("projectProfitability_view");
  if (!hasPermission) throw new Error("Permission denied");

  await connectToDB();

  const projects = await Project.find({
    organizationId: user.organizationId,
    del_flag: false
  }).populate("managerId", "name").sort({ createdAt: -1 }).lean();

  const totalRevenue = projects.reduce((sum: number, p: any) => sum + p.revenue, 0);
  const totalCost = projects.reduce((sum: number, p: any) => sum + p.actualCost, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0.0";

  const projectsWithMetrics = projects.map((p: any) => {
    const profit = p.revenue - p.actualCost;
    const margin = p.revenue > 0 ? ((profit / p.revenue) * 100).toFixed(1) : "0.0";
    return { ...p, profit, margin };
  });

  return JSON.parse(JSON.stringify({
    projects: projectsWithMetrics,
    summary: { totalRevenue, totalCost, totalProfit, avgMargin }
  }));
}

export const getProjectProfitability = await withAuth(_getProjectProfitability);
