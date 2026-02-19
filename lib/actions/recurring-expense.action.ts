"use server";

import { revalidatePath } from "next/cache";
import RecurringExpense, { IRecurringExpense } from "@/lib/models/recurring-expense.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";

// Create Recurring Expense
async function _createRecurringExpense(
  user: User,
  data: Partial<IRecurringExpense>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("recurringExpenses_create");
    if (!hasPermission) {
      return { error: "You don't have permission to create recurring expenses" };
    }

    await connectToDB();

    const expenseNumber = `REC-${Date.now().toString().slice(-6)}`;

    const recurringExpense = await RecurringExpense.create({
      ...data,
      expenseNumber,
      organizationId: user.organizationId,
      createdBy: user._id,
      mod_flag: false,
      del_flag: false,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "recurring_expense",
      resourceId: String(recurringExpense._id),
      details: { after: recurringExpense },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(recurringExpense)) };
  } catch (error: any) {
    console.error("Create recurring expense error:", error);
    return { error: error.message || "Failed to create recurring expense" };
  }
}

export const createRecurringExpense = await withAuth(_createRecurringExpense);

// Get Recurring Expenses
async function _getRecurringExpenses(user: User) {
  try {
    const hasPermission = await checkPermission("recurringExpenses_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view recurring expenses" };
    }

    await connectToDB();

    const recurringExpenses = await RecurringExpense.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("vendorId", "companyName")
      .populate("categoryId", "name")
      .sort({ nextDate: 1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(recurringExpenses)) };
  } catch (error: any) {
    console.error("Get recurring expenses error:", error);
    return { error: error.message || "Failed to fetch recurring expenses" };
  }
}

export const getRecurringExpenses = await withAuth(_getRecurringExpenses);

// Get Recurring Expense by ID
async function _getRecurringExpenseById(user: User, expenseId: string) {
  try {
    const hasPermission = await checkPermission("recurringExpenses_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view recurring expenses" };
    }

    await connectToDB();

    const recurringExpense = await RecurringExpense.findOne({
      _id: expenseId,
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("vendorId", "companyName email phone")
      .populate("categoryId", "name")
      .lean();

    if (!recurringExpense) {
      return { error: "Recurring expense not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(recurringExpense)) };
  } catch (error: any) {
    console.error("Get recurring expense error:", error);
    return { error: error.message || "Failed to fetch recurring expense" };
  }
}

export const getRecurringExpenseById = await withAuth(_getRecurringExpenseById);

// Update Recurring Expense
async function _updateRecurringExpense(
  user: User,
  expenseId: string,
  data: Partial<IRecurringExpense>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("recurringExpenses_update");
    if (!hasPermission) {
      return { error: "You don't have permission to update recurring expenses" };
    }

    await connectToDB();

    const oldRecurringExpense = await RecurringExpense.findOne({
      _id: expenseId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!oldRecurringExpense) {
      return { error: "Recurring expense not found" };
    }

    const recurringExpense = await RecurringExpense.findOneAndUpdate(
      {
        _id: expenseId,
        organizationId: user.organizationId,
        del_flag: false,
      },
      {
        ...data,
        modifiedBy: user._id,
        mod_flag: true,
      },
      { new: true }
    );

    if (!recurringExpense) {
      return { error: "Recurring expense not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "recurring_expense",
      resourceId: String(expenseId),
      details: { before: oldRecurringExpense, after: recurringExpense },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(recurringExpense)) };
  } catch (error: any) {
    console.error("Update recurring expense error:", error);
    return { error: error.message || "Failed to update recurring expense" };
  }
}

export const updateRecurringExpense = await withAuth(_updateRecurringExpense);

// Delete Recurring Expense
async function _deleteRecurringExpense(
  user: User,
  expenseId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("recurringExpenses_delete");
    if (!hasPermission) {
      return { error: "You don't have permission to delete recurring expenses" };
    }

    await connectToDB();

    const recurringExpense = await RecurringExpense.findOneAndUpdate(
      {
        _id: expenseId,
        organizationId: user.organizationId,
        del_flag: false,
      },
      {
        del_flag: true,
        deletedBy: user._id,
      },
      { new: true }
    );

    if (!recurringExpense) {
      return { error: "Recurring expense not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "recurring_expense",
      resourceId: String(expenseId),
      details: { before: recurringExpense },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    console.error("Delete recurring expense error:", error);
    return { error: error.message || "Failed to delete recurring expense" };
  }
}

export const deleteRecurringExpense = await withAuth(_deleteRecurringExpense);
