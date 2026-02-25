"use server"

import { revalidatePath } from "next/cache"
import Expense, { IExpense } from "@/lib/models/expense.model"
import { checkPermission } from "@/lib/helpers/check-permission"
import { checkWriteAccess } from "@/lib/helpers/check-write-access"
import { connectToDB } from "../connection/mongoose"
import { withAuth, type User } from "../helpers/auth"
import { logAudit } from "../helpers/audit"
import { postExpenseToGL } from "../helpers/expense-accounting"

// Create Expense
async function _createExpense(
  user: User,
  data: Partial<IExpense>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("expenses_create")
    if (!hasPermission) {
      return { error: "You don't have permission to create expenses" }
    }

    await connectToDB()

    // Generate expense number
    const expenseNumber = `EXP-${Date.now().toString().slice(-6)}`

    const expense = await Expense.create({
      ...data,
      expenseNumber,
      organizationId: user.organizationId,
      createdBy: user._id || user.id,
      mod_flag: false,
      del_flag: false
    })

    if (data.status === "paid") {
      await postExpenseToGL(String(expense._id), String(user._id || user.id))
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "expense",
      resourceId: String(expense._id),
      details: { after: expense },
    })

    revalidatePath(path)
    if (data.projectId) {
      revalidatePath(`/projects/all/${data.projectId}`);
    }
    return { success: true, data: JSON.parse(JSON.stringify(expense)) }
  } catch (error: any) {
    console.error("Create expense error:", error)
    return { error: error.message || "Failed to create expense" }
  }
}

export const createExpense = await withAuth(_createExpense)

// Get Expenses
async function _getExpenses(user: User) {
  try {
    const hasPermission = await checkPermission("expenses_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view expenses" }
    }

    await connectToDB()

    const expenses = await Expense.find({
      organizationId: user.organizationId,
      del_flag: false
    })
      .populate("vendorId", "companyName")
      .populate("categoryId", "name")
      .sort({ date: -1 })
      .lean()

    return { success: true, data: JSON.parse(JSON.stringify(expenses)) }
  } catch (error: any) {
    console.error("Get expenses error:", error)
    return { error: error.message || "Failed to fetch expenses" }
  }
}

export const getExpenses = await withAuth(_getExpenses)

// Get Expense by ID
async function _getExpenseById(user: User, expenseId: string) {
  try {
    const hasPermission = await checkPermission("expenses_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view expenses" }
    }

    await connectToDB()

    const expense = await Expense.findOne({
      _id: expenseId,
      organizationId: user.organizationId,
      del_flag: false
    })
      .populate("vendorId", "companyName")
      .populate("categoryId", "name")
      .lean()

    if (!expense) {
      return { error: "Expense not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(expense)) }
  } catch (error: any) {
    console.error("Get expense error:", error)
    return { error: error.message || "Failed to fetch expense" }
  }
}

export const getExpenseById = await withAuth(_getExpenseById)

// Update Expense
async function _updateExpense(
  user: User,
  expenseId: string,
  data: Partial<IExpense>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("expenses_update")
    if (!hasPermission) {
      return { error: "You don't have permission to update expenses" }
    }

    await connectToDB()

    const oldExpense = await Expense.findOne({
      _id: expenseId,
      organizationId: user.organizationId,
      del_flag: false
    })

    if (!oldExpense) {
      return { error: "Expense not found" }
    }

    const expense = await Expense.findOneAndUpdate(
      {
        _id: expenseId,
        organizationId: user.organizationId,
        del_flag: false
      },
      {
        ...data,
        modifiedBy: user.id,
        mod_flag: true
      },
      { new: true }
    )

    if (!expense) {
      return { error: "Expense not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "expense",
      resourceId: String(expenseId),
      details: { before: oldExpense, after: expense },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(expense)) }
  } catch (error: any) {
    console.error("Update expense error:", error)
    return { error: error.message || "Failed to update expense" }
  }
}

export const updateExpense = await withAuth(_updateExpense)

// Delete Expense
async function _deleteExpense(
  user: User,
  expenseId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("expenses_delete")
    if (!hasPermission) {
      return { error: "You don't have permission to delete expenses" }
    }

    await connectToDB()

    const expense = await Expense.findOneAndUpdate(
      {
        _id: expenseId,
        organizationId: user.organizationId,
        del_flag: false
      },
      {
        del_flag: true,
        deletedBy: user.id
      },
      { new: true }
    )

    if (!expense) {
      return { error: "Expense not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "expense",
      resourceId: String(expenseId),
      details: { before: expense },
    })

    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    console.error("Delete expense error:", error)
    return { error: error.message || "Failed to delete expense" }
  }
}

export const deleteExpense = await withAuth(_deleteExpense)

// Get Expense Summary
async function _getExpenseSummary(user: User) {
  try {
    const hasPermission = await checkPermission("expenses_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view expenses" }
    }

    await connectToDB()

    const expenses = await Expense.find({
      organizationId: user.organizationId,
      del_flag: false
    }).lean()

    const totalExpenses = expenses.length
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const pending = expenses.filter(exp => exp.status === "pending").length
    const paid = expenses.filter(exp => exp.status === "paid").length

    return {
      success: true,
      data: {
        totalExpenses,
        totalAmount,
        pending,
        paid
      }
    }
  } catch (error: any) {
    console.error("Get expense summary error:", error)
    return { error: error.message || "Failed to fetch expense summary" }
  }
}

export const getExpenseSummary = await withAuth(_getExpenseSummary)

// Approve Expense
async function _approveExpense(
  user: User,
  expenseId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("expenses_approve")
    if (!hasPermission) {
      return { error: "You don't have permission to approve expenses" }
    }

    await connectToDB()

    const expense = await Expense.findOneAndUpdate(
      {
        _id: expenseId,
        organizationId: user.organizationId,
        del_flag: false
      },
      {
        status: "approved",
        approvedBy: user._id || user.id,
        approvedAt: new Date(),
        modifiedBy: user._id || user.id,
        mod_flag: true
      },
      { new: true }
    )

    if (!expense) {
      return { error: "Expense not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "approve",
      resource: "expense",
      resourceId: String(expenseId),
      details: { status: "approved" },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(expense)) }
  } catch (error: any) {
    console.error("Approve expense error:", error)
    return { error: error.message || "Failed to approve expense" }
  }
}

export const approveExpense = await withAuth(_approveExpense)

// Reject Expense
async function _rejectExpense(
  user: User,
  expenseId: string,
  reason: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("expenses_approve")
    if (!hasPermission) {
      return { error: "You don't have permission to reject expenses" }
    }

    await connectToDB()

    const expense = await Expense.findOneAndUpdate(
      {
        _id: expenseId,
        organizationId: user.organizationId,
        del_flag: false
      },
      {
        status: "rejected",
        rejectedBy: user._id || user.id,
        rejectedAt: new Date(),
        rejectionReason: reason,
        modifiedBy: user._id || user.id,
        mod_flag: true
      },
      { new: true }
    )

    if (!expense) {
      return { error: "Expense not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "reject",
      resource: "expense",
      resourceId: String(expenseId),
      details: { status: "rejected", reason },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(expense)) }
  } catch (error: any) {
    console.error("Reject expense error:", error)
    return { error: error.message || "Failed to reject expense" }
  }
}

export const rejectExpense = await withAuth(_rejectExpense)

// Mark Expense as Paid
async function _markExpenseAsPaid(
  user: User,
  expenseId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("expenses_update")
    if (!hasPermission) {
      return { error: "You don't have permission to mark expenses as paid" }
    }

    await connectToDB()

    const expense = await Expense.findOne({
      _id: expenseId,
      organizationId: user.organizationId,
      del_flag: false
    })

    if (!expense) {
      return { error: "Expense not found" }
    }

    if (expense.status === "rejected") {
      return { error: "Cannot mark rejected expense as paid" }
    }

    expense.status = "paid"
    expense.modifiedBy = user._id || user.id
    expense.mod_flag = true
    await expense.save()

    // Post to general ledger when marked as paid
    await postExpenseToGL(String(expense._id), String(user._id || user.id))

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "mark_paid",
      resource: "expense",
      resourceId: String(expenseId),
      details: { status: "paid" },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(expense)) }
  } catch (error: any) {
    console.error("Mark expense as paid error:", error)
    return { error: error.message || "Failed to mark expense as paid" }
  }
}

export const markExpenseAsPaid = await withAuth(_markExpenseAsPaid)
