"use server";

import { connectToDB } from "../connection/mongoose";
import Project from "../models/project.model";
import JournalEntry from "../models/journal-entry.model";

export async function postProjectRevenueToGL(projectId: string, amount: number, description: string, userId: string) {
  try {
    await connectToDB();

    const project = await Project.findById(projectId);
    if (!project) return { error: "Project not found" };

    if (!project.revenueAccountId) return { error: "Revenue account not configured" };

    const lineItems = [
      {
        accountId: project.revenueAccountId,
        description: `${description} - ${project.name}`,
        debit: 0,
        credit: amount,
      },
    ];

    await JournalEntry.create({
      organizationId: project.organizationId,
      entryNumber: `JE-PRJ-REV-${Date.now().toString().slice(-8)}`,
      entryDate: new Date(),
      referenceType: "project",
      referenceId: projectId,
      description: `Project revenue: ${project.name}`,
      lineItems,
      totalDebit: amount,
      totalCredit: amount,
      status: "posted",
      createdBy: userId,
      del_flag: false,
      mod_flag: 0,
    });

    project.revenue += amount;
    await project.save();

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function postProjectExpenseToGL(projectId: string, amount: number, description: string, userId: string) {
  try {
    await connectToDB();

    const project = await Project.findById(projectId);
    if (!project) return { error: "Project not found" };

    if (!project.expenseAccountId) return { error: "Expense account not configured" };

    const lineItems = [
      {
        accountId: project.expenseAccountId,
        description: `${description} - ${project.name}`,
        debit: amount,
        credit: 0,
      },
    ];

    await JournalEntry.create({
      organizationId: project.organizationId,
      entryNumber: `JE-PRJ-EXP-${Date.now().toString().slice(-8)}`,
      entryDate: new Date(),
      referenceType: "project",
      referenceId: projectId,
      description: `Project expense: ${project.name}`,
      lineItems,
      totalDebit: amount,
      totalCredit: amount,
      status: "posted",
      createdBy: userId,
      del_flag: false,
      mod_flag: 0,
    });

    project.actualCost += amount;
    await project.save();

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
