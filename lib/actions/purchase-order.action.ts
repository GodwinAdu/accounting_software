"use server"

import { revalidatePath } from "next/cache"
import PurchaseOrder, { IPurchaseOrder } from "@/lib/models/purchase-order.model"
import { checkPermission } from "@/lib/helpers/check-permission"
import { checkWriteAccess } from "@/lib/helpers/check-write-access"
import { connectToDB } from "../connection/mongoose"
import { withAuth, type User } from "../helpers/auth"
import { logAudit } from "../helpers/audit"
import { postPurchaseOrderToGL } from "../helpers/purchases-accounting"

// Create Purchase Order
async function _createPurchaseOrder(
  user: User,
  data: Partial<IPurchaseOrder>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("purchaseOrders_create")
    if (!hasPermission) {
      return { error: "You don't have permission to create purchase orders" }
    }

    await connectToDB()

    // Generate PO number
    const poNumber = `PO-${Date.now().toString().slice(-6)}`

    const purchaseOrder = await PurchaseOrder.create({
      ...data,
      poNumber,
      organizationId: user.organizationId,
      createdBy: user._id,
      mod_flag: false,
      del_flag: false
    })

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "purchase_order",
      resourceId: String(purchaseOrder._id),
      details: { after: purchaseOrder },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(purchaseOrder)) }
  } catch (error: any) {
    console.error("Create purchase order error:", error)
    return { error: error.message || "Failed to create purchase order" }
  }
}

export const createPurchaseOrder = await withAuth(_createPurchaseOrder)

// Get Purchase Orders
async function _getPurchaseOrders(user: User) {
  try {
    const hasPermission = await checkPermission("purchaseOrders_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view purchase orders" }
    }

    await connectToDB()

    const purchaseOrders = await PurchaseOrder.find({
      organizationId: user.organizationId,
      del_flag: false
    })
      .populate("vendorId", "companyName")
      .sort({ orderDate: -1 })
      .lean()

    return { success: true, data: JSON.parse(JSON.stringify(purchaseOrders)) }
  } catch (error: any) {
    console.error("Get purchase orders error:", error)
    return { error: error.message || "Failed to fetch purchase orders" }
  }
}

export const getPurchaseOrders = await withAuth(_getPurchaseOrders)

// Get Purchase Order by ID
async function _getPurchaseOrderById(user: User, poId: string) {
  try {
    const hasPermission = await checkPermission("purchaseOrders_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view purchase orders" }
    }

    await connectToDB()

    const purchaseOrder = await PurchaseOrder.findOne({
      _id: poId,
      organizationId: user.organizationId,
      del_flag: false
    })
      .populate("vendorId", "companyName email phone")
      .lean()

    if (!purchaseOrder) {
      return { error: "Purchase order not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(purchaseOrder)) }
  } catch (error: any) {
    console.error("Get purchase order error:", error)
    return { error: error.message || "Failed to fetch purchase order" }
  }
}

export const getPurchaseOrderById = await withAuth(_getPurchaseOrderById)

// Update Purchase Order
async function _updatePurchaseOrder(
  user: User,
  poId: string,
  data: Partial<IPurchaseOrder>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("purchaseOrders_update")
    if (!hasPermission) {
      return { error: "You don't have permission to update purchase orders" }
    }

    await connectToDB()

    const oldPurchaseOrder = await PurchaseOrder.findOne({
      _id: poId,
      organizationId: user.organizationId,
      del_flag: false
    })

    if (!oldPurchaseOrder) {
      return { error: "Purchase order not found" }
    }

    const purchaseOrder = await PurchaseOrder.findOneAndUpdate(
      {
        _id: poId,
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

    if (!purchaseOrder) {
      return { error: "Purchase order not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "purchase_order",
      resourceId: String(poId),
      details: { before: oldPurchaseOrder, after: purchaseOrder },
    })

    // Post to GL when goods are received
    if (data.status === "received" && oldPurchaseOrder.status !== "received") {
      await postPurchaseOrderToGL(String(poId), String(user._id || user.id))
    }

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(purchaseOrder)) }
  } catch (error: any) {
    console.error("Update purchase order error:", error)
    return { error: error.message || "Failed to update purchase order" }
  }
}

export const updatePurchaseOrder = await withAuth(_updatePurchaseOrder)

// Delete Purchase Order
async function _deletePurchaseOrder(
  user: User,
  poId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("purchaseOrders_delete")
    if (!hasPermission) {
      return { error: "You don't have permission to delete purchase orders" }
    }

    await connectToDB()

    const purchaseOrder = await PurchaseOrder.findOneAndUpdate(
      {
        _id: poId,
        organizationId: user.organizationId,
        del_flag: false
      },
      {
        del_flag: true,
        deletedBy: user.id
      },
      { new: true }
    )

    if (!purchaseOrder) {
      return { error: "Purchase order not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "purchase_order",
      resourceId: String(poId),
      details: { before: purchaseOrder },
    })

    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    console.error("Delete purchase order error:", error)
    return { error: error.message || "Failed to delete purchase order" }
  }
}

export const deletePurchaseOrder = await withAuth(_deletePurchaseOrder)
