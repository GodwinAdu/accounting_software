"use server"

import { revalidatePath } from "next/cache"
import Product, { IProduct } from "@/lib/models/product.model"
import { checkPermission } from "@/lib/helpers/check-permission"
import { checkWriteAccess } from "@/lib/helpers/check-write-access"
import { connectToDB } from "../connection/mongoose"
import { withAuth, type User } from "../helpers/auth"
import { logAudit } from "../helpers/audit"

// Create Product
async function _createProduct(
  user: User,
  data: Partial<IProduct>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("products_create")
    if (!hasPermission) {
      return { error: "You don't have permission to create products" }
    }

    await connectToDB()

    // Calculate margin if not provided
    if (data.costPrice && data.sellingPrice && !data.margin) {
      data.margin = ((data.sellingPrice - data.costPrice) / data.sellingPrice) * 100
    }

    const product = await Product.create({
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
      resource: "product",
      resourceId: String(product._id),
      details: { after: product },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(product)) }
  } catch (error: any) {
    console.error("Create product error:", error)
    return { error: error.message || "Failed to create product" }
  }
}

export const createProduct = await withAuth(_createProduct)

// Get Products
async function _getProducts(user: User) {
  try {
    if(!user) throw new Error("User not found")
    const hasPermission = await checkPermission("products_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view products" }
    }

    await connectToDB()

    const products = await Product.find({
      organizationId: user.organizationId,
      del_flag: false
    })
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .lean()

      console.log("product",products)

    return { success: true, data: JSON.parse(JSON.stringify(products)) }
  } catch (error: any) {
    console.error("Get products error:", error)
    return { error: error.message || "Failed to fetch products" }
  }
}

export const getProducts = await withAuth(_getProducts)

// Get Product by ID
async function _getProductById(user: User, productId: string) {
  try {
    const hasPermission = await checkPermission("products_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view products" }
    }

    await connectToDB()

    const product = await Product.findOne({
      _id: productId,
      organizationId: user.organizationId,
      del_flag: false
    })
      .populate("categoryId", "name")
      .lean()

    if (!product) {
      return { error: "Product not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(product)) }
  } catch (error: any) {
    console.error("Get product error:", error)
    return { error: error.message || "Failed to fetch product" }
  }
}

export const getProductById = await withAuth(_getProductById)

// Update Product
async function _updateProduct(
  user: User,
  productId: string,
  data: Partial<IProduct>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("products_update")
    if (!hasPermission) {
      return { error: "You don't have permission to update products" }
    }

    await connectToDB()

    // Calculate margin if prices changed
    if (data.costPrice && data.sellingPrice) {
      data.margin = ((data.sellingPrice - data.costPrice) / data.sellingPrice) * 100
    }

    const oldProduct = await Product.findOne({
      _id: productId,
      organizationId: user.organizationId,
      del_flag: false
    })

    if (!oldProduct) {
      return { error: "Product not found" }
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
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

    if (!product) {
      return { error: "Product not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "product",
      resourceId: String(productId),
      details: { before: oldProduct, after: product },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(product)) }
  } catch (error: any) {
    console.error("Update product error:", error)
    return { error: error.message || "Failed to update product" }
  }
}

export const updateProduct = await withAuth(_updateProduct)

// Delete Product (Soft Delete)
async function _deleteProduct(
  user: User,
  productId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("products_delete")
    if (!hasPermission) {
      return { error: "You don't have permission to delete products" }
    }

    await connectToDB()

    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
        organizationId: user.organizationId,
        del_flag: false
      },
      {
        del_flag: true,
        deletedBy: user.id
      },
      { new: true }
    )

    if (!product) {
      return { error: "Product not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "product",
      resourceId: String(productId),
      details: { before: product },
    })

    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    console.error("Delete product error:", error)
    return { error: error.message || "Failed to delete product" }
  }
}

export const deleteProduct = await withAuth(_deleteProduct)

// Get Low Stock Products
async function _getLowStockProducts(user: User) {
  try {
    const hasPermission = await checkPermission("inventory_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view inventory" }
    }

    await connectToDB()

    const products = await Product.find({
      organizationId: user.organizationId,
      del_flag: false,
      trackInventory: true,
      $expr: { $lte: ["$currentStock", "$reorderLevel"] }
    })
      .populate("categoryId", "name")
      .sort({ currentStock: 1 })
      .lean()

    return { success: true, data: JSON.parse(JSON.stringify(products)) }
  } catch (error: any) {
    console.error("Get low stock products error:", error)
    return { error: error.message || "Failed to fetch low stock products" }
  }
}

export const getLowStockProducts = await withAuth(_getLowStockProducts)

// Get Inventory Summary
async function _getInventorySummary(user: User) {
  try {
    const hasPermission = await checkPermission("inventory_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view inventory" }
    }

    await connectToDB()

    const products = await Product.find({
      organizationId: user.organizationId,
      del_flag: false,
      trackInventory: true
    }).lean()

    const totalProducts = products.length
    const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.costPrice), 0)
    const lowStock = products.filter(p => p.currentStock <= p.reorderLevel).length
    const outOfStock = products.filter(p => p.currentStock === 0).length

    return {
      success: true,
      data: {
        totalProducts,
        totalValue,
        lowStock,
        outOfStock
      }
    }
  } catch (error: any) {
    console.error("Get inventory summary error:", error)
    return { error: error.message || "Failed to fetch inventory summary" }
  }
}

export const getInventorySummary = await withAuth(_getInventorySummary)
