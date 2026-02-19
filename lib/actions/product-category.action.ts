"use server"

import { revalidatePath } from "next/cache"
import ProductCategory, { IProductCategory } from "@/lib/models/product-category.model"
import Product from "@/lib/models/product.model"
import { checkPermission } from "@/lib/helpers/check-permission"
import { checkWriteAccess } from "@/lib/helpers/check-write-access"
import { connectToDB } from "../connection/mongoose"
import { withAuth, type User } from "../helpers/auth"
import { logAudit } from "../helpers/audit"

// Create Category
async function _createProductCategory(
  user: User,
  data: Partial<IProductCategory>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    if(!user) throw new Error("Unauthorized")
    const hasPermission = await checkPermission("productCategories_create")
    if (!hasPermission) {
      return { error: "You don't have permission to create categories" }
    }

    await connectToDB()

    const category = await ProductCategory.create({
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
      resource: "product_category",
      resourceId: String(category._id),
      details: { after: category },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(category)) }
  } catch (error: any) {
    console.error("Create category error:", error)
    return { error: error.message || "Failed to create category" }
  }
}

export const createProductCategory = await withAuth(_createProductCategory)

// Get Categories
async function _getProductCategories(user: User) {
  try {
    const hasPermission = await checkPermission("productCategories_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view categories" }
    }

    await connectToDB()

    const categories = await ProductCategory.find({
      organizationId: user.organizationId,
      del_flag: false
    })
      .sort({ name: 1 })
      .lean()

    // Get product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({
          organizationId: user.organizationId,
          categoryId: category._id,
          del_flag: false
        })
        return {
          ...category,
          productCount
        }
      })
    )

    return { success: true, data: JSON.parse(JSON.stringify(categoriesWithCount)) }
  } catch (error: any) {
    console.error("Get categories error:", error)
    return { error: error.message || "Failed to fetch categories" }
  }
}

export const getProductCategories = await withAuth(_getProductCategories)

// Update Category
async function _updateProductCategory(
  user: User,
  categoryId: string,
  data: Partial<IProductCategory>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("productCategories_update")
    if (!hasPermission) {
      return { error: "You don't have permission to update categories" }
    }

    await connectToDB()

    const oldCategory = await ProductCategory.findOne({
      _id: categoryId,
      organizationId: user.organizationId,
      del_flag: false
    })

    if (!oldCategory) {
      return { error: "Category not found" }
    }

    const category = await ProductCategory.findOneAndUpdate(
      {
        _id: categoryId,
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

    if (!category) {
      return { error: "Category not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "product_category",
      resourceId: String(categoryId),
      details: { before: oldCategory, after: category },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(category)) }
  } catch (error: any) {
    console.error("Update category error:", error)
    return { error: error.message || "Failed to update category" }
  }
}

export const updateProductCategory = await withAuth(_updateProductCategory)

// Delete Category
async function _deleteProductCategory(
  user: User,
  categoryId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("productCategories_delete")
    if (!hasPermission) {
      return { error: "You don't have permission to delete categories" }
    }

    await connectToDB()

    // Check if category has products
    const productCount = await Product.countDocuments({
      organizationId: user.organizationId,
      categoryId,
      del_flag: false
    })

    if (productCount > 0) {
      return { error: "Cannot delete category with existing products" }
    }

    const category = await ProductCategory.findOneAndUpdate(
      {
        _id: categoryId,
        organizationId: user.organizationId,
        del_flag: false
      },
      {
        del_flag: true,
        deletedBy: user.id
      },
      { new: true }
    )

    if (!category) {
      return { error: "Category not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "product_category",
      resourceId: String(categoryId),
      details: { before: category },
    })

    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    console.error("Delete category error:", error)
    return { error: error.message || "Failed to delete category" }
  }
}

export const deleteProductCategory = await withAuth(_deleteProductCategory)
