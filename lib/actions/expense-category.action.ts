"use server"

import { revalidatePath } from "next/cache"
import ExpenseCategory, { IExpenseCategory } from "@/lib/models/expense-category.model"
import { checkPermission } from "@/lib/helpers/check-permission"
import { checkWriteAccess } from "@/lib/helpers/check-write-access"
import { connectToDB } from "../connection/mongoose"
import { withAuth, type User } from "../helpers/auth"
import { logAudit } from "../helpers/audit"

// Create Category
async function _createExpenseCategory(
  user: User,
  data: Partial<IExpenseCategory>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("expenseCategories_create")
    if (!hasPermission) {
      return { error: "You don't have permission to create expense categories" }
    }

    await connectToDB()

    const category = await ExpenseCategory.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id,
      mod_flag: false,
      del_flag: false
    })

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "expense_category",
      resourceId: String(category._id),
      details: { after: category },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(category)) }
  } catch (error: any) {
    console.error("Create expense category error:", error)
    return { error: error.message || "Failed to create expense category" }
  }
}

export const createExpenseCategory = await withAuth(_createExpenseCategory)

// Get Categories
async function _getExpenseCategories(user: User) {
  try {
    const hasPermission = await checkPermission("expenseCategories_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view expense categories" }
    }

    await connectToDB()

    const categories = await ExpenseCategory.find({
      organizationId: user.organizationId,
      del_flag: false
    })
      .sort({ name: 1 })
      .lean()

    return { success: true, data: JSON.parse(JSON.stringify(categories)) }
  } catch (error: any) {
    console.error("Get expense categories error:", error)
    return { error: error.message || "Failed to fetch expense categories" }
  }
}

export const getExpenseCategories = await withAuth(_getExpenseCategories)

// Update Category
async function _updateExpenseCategory(
  user: User,
  categoryId: string,
  data: Partial<IExpenseCategory>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("expenseCategories_update")
    if (!hasPermission) {
      return { error: "You don't have permission to update expense categories" }
    }

    await connectToDB()

    const oldCategory = await ExpenseCategory.findOne({
      _id: categoryId,
      organizationId: user.organizationId,
      del_flag: false
    })

    if (!oldCategory) {
      return { error: "Expense category not found" }
    }

    const category = await ExpenseCategory.findOneAndUpdate(
      {
        _id: categoryId,
        organizationId: user.organizationId,
        del_flag: false
      },
      {
        ...data,
        modifiedBy: user._id,
        mod_flag: true
      },
      { new: true }
    )

    if (!category) {
      return { error: "Expense category not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "expense_category",
      resourceId: String(categoryId),
      details: { before: oldCategory, after: category },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(category)) }
  } catch (error: any) {
    console.error("Update expense category error:", error)
    return { error: error.message || "Failed to update expense category" }
  }
}

export const updateExpenseCategory = await withAuth(_updateExpenseCategory)

// Delete Category
async function _deleteExpenseCategory(
  user: User,
  categoryId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("expenseCategories_delete")
    if (!hasPermission) {
      return { error: "You don't have permission to delete expense categories" }
    }

    await connectToDB()

    const category = await ExpenseCategory.findOneAndUpdate(
      {
        _id: categoryId,
        organizationId: user.organizationId,
        del_flag: false
      },
      {
        del_flag: true,
        deletedBy: user?._id
      },
      { new: true }
    )

    if (!category) {
      return { error: "Expense category not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "expense_category",
      resourceId: String(categoryId),
      details: { before: category },
    })

    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    console.error("Delete expense category error:", error)
    return { error: error.message || "Failed to delete expense category" }
  }
}

export const deleteExpenseCategory = await withAuth(_deleteExpenseCategory)
