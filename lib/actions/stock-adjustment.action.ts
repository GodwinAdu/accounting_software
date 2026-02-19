"use server"

import { revalidatePath } from "next/cache"
import StockAdjustment, { IStockAdjustment } from "@/lib/models/stock-adjustment.model"
import Product from "@/lib/models/product.model"
import { currentUser } from "@/lib/helpers/session"
import { checkPermission } from "@/lib/helpers/check-permission"
import { checkWriteAccess } from "@/lib/helpers/check-write-access"
import { connectToDB } from "../connection/mongoose"
import { logAudit } from "../helpers/audit"

// Create Stock Adjustment
export async function createStockAdjustment(
  data: Partial<IStockAdjustment>,
  organizationId: string,
  path: string
) {
  try {
    await checkWriteAccess(organizationId);
    await connectToDB()
    const user = await currentUser()
    
    if (!user) {
      return { error: "Unauthorized" }
    }

    const hasPermission = await checkPermission("stockAdjustments_create")
    if (!hasPermission) {
      return { error: "You don't have permission to create stock adjustments" }
    }

    // Get current product stock
    const product = await Product.findOne({
      _id: data.productId,
      organizationId,
      del_flag: false
    })

    if (!product) {
      return { error: "Product not found" }
    }

    if (!product.trackInventory) {
      return { error: "Product does not track inventory" }
    }

    const previousStock = product.currentStock
    let newStock = previousStock

    // Calculate new stock based on adjustment type
    if (data.type === "increase") {
      newStock = previousStock + (data.quantity || 0)
    } else if (data.type === "decrease") {
      newStock = previousStock - (data.quantity || 0)
      if (newStock < 0) {
        return { error: "Insufficient stock for decrease" }
      }
    }

    // Create adjustment record
    const adjustment = await StockAdjustment.create({
      ...data,
      organizationId,
      previousStock,
      newStock,
      createdBy: user.id,
      mod_flag: false,
      del_flag: false
    })

    // Update product stock
    await Product.findByIdAndUpdate(data.productId, {
      currentStock: newStock,
      modifiedBy: user.id,
      mod_flag: true
    })

    await logAudit({
      organizationId: String(organizationId),
      userId: String(user.id),
      action: "create",
      resource: "stock_adjustment",
      resourceId: String(adjustment._id),
      details: { after: adjustment },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(adjustment)) }
  } catch (error: any) {
    console.error("Create stock adjustment error:", error)
    return { error: error.message || "Failed to create stock adjustment" }
  }
}

// Get Stock Adjustments
export async function getStockAdjustments(organizationId: string) {
  try {
    await connectToDB()
    const user = await currentUser()
    
    if (!user) {
      return { error: "Unauthorized" }
    }

    const hasPermission = await checkPermission("stockAdjustments_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view stock adjustments" }
    }

    const adjustments = await StockAdjustment.find({
      organizationId,
      del_flag: false
    })
      .populate("productId", "name sku")
      .populate("createdBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean()

    return { success: true, data: JSON.parse(JSON.stringify(adjustments)) }
  } catch (error: any) {
    console.error("Get stock adjustments error:", error)
    return { error: error.message || "Failed to fetch stock adjustments" }
  }
}

// Get Stock Adjustments by Product
export async function getStockAdjustmentsByProduct(
  productId: string,
  organizationId: string
) {
  try {
    await connectToDB()
    const user = await currentUser()
    
    if (!user) {
      return { error: "Unauthorized" }
    }

    const hasPermission = await checkPermission("stockAdjustments_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view stock adjustments" }
    }

    const adjustments = await StockAdjustment.find({
      organizationId,
      productId,
      del_flag: false
    })
      .populate("createdBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean()

    return { success: true, data: JSON.parse(JSON.stringify(adjustments)) }
  } catch (error: any) {
    console.error("Get product adjustments error:", error)
    return { error: error.message || "Failed to fetch product adjustments" }
  }
}
