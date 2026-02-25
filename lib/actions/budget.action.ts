"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Budget from "@/lib/models/budget.model";
import { withAuth } from "@/lib/helpers/auth";
import { revalidatePath } from "next/cache";

async function _createBudget(user: any, data: {
  name: string;
  fiscalYear: number;
  startDate: Date;
  endDate: Date;
  departmentId?: string;
  lineItems: Array<{
    accountId: string;
    accountCode: string;
    accountName: string;
    budgetedAmount: number;
    allocations: Array<{ month: number; amount: number }>;
  }>;
  notes?: string;
}) {
  try {
    await connectToDB();

    const count = await Budget.countDocuments({ organizationId: user.organizationId });
    const budgetNumber = `BUD-${data.fiscalYear}-${String(count + 1).padStart(4, "0")}`;

    const totalBudget = data.lineItems.reduce((sum, item) => sum + item.budgetedAmount, 0);

    const budget = await Budget.create({
      ...data,
      budgetNumber,
      organizationId: user.organizationId,
      totalBudget,
      status: "draft",
      del_flag: false,
      createdBy: user._id,
      mod_flag: false,
    });

    revalidatePath("/dashboard/budgeting");
    return { success: true, budget: JSON.parse(JSON.stringify(budget)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const createBudget = await withAuth(_createBudget);

async function _getAllBudgets(user: any) {
  try {
    await connectToDB();

    const budgets = await Budget.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("departmentId", "name")
      .sort({ fiscalYear: -1, createdAt: -1 });

    return { success: true, budgets: JSON.parse(JSON.stringify(budgets)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const getAllBudgets = await withAuth(_getAllBudgets);

async function _getBudgetById(user: any, budgetId: string) {
  try {
    await connectToDB();

    const budget = await Budget.findOne({
      _id: budgetId,
      organizationId: user.organizationId,
      del_flag: false,
    }).populate("departmentId", "name");

    if (!budget) throw new Error("Budget not found");

    return { success: true, budget: JSON.parse(JSON.stringify(budget)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const getBudgetById = await withAuth(_getBudgetById);

async function _updateBudget(user: any, budgetId: string, data: any) {
  try {
    await connectToDB();

    if (data.lineItems) {
      data.totalBudget = data.lineItems.reduce((sum: number, item: any) => sum + item.budgetedAmount, 0);
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!budget) throw new Error("Budget not found");

    revalidatePath("/dashboard/budgeting");
    return { success: true, budget: JSON.parse(JSON.stringify(budget)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const updateBudget = await withAuth(_updateBudget);

async function _activateBudget(user: any, budgetId: string) {
  try {
    await connectToDB();

    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, organizationId: user.organizationId, del_flag: false },
      { status: "active", modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!budget) throw new Error("Budget not found");

    revalidatePath("/dashboard/budgeting");
    return { success: true, budget: JSON.parse(JSON.stringify(budget)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const activateBudget = await withAuth(_activateBudget);

async function _deleteBudget(user: any, budgetId: string) {
  try {
    await connectToDB();

    await Budget.findOneAndUpdate(
      { _id: budgetId, organizationId: user.organizationId },
      { del_flag: true, modifiedBy: user._id, mod_flag: true }
    );

    revalidatePath("/dashboard/budgeting");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const deleteBudget = await withAuth(_deleteBudget);

export const getBudgets = getAllBudgets;
