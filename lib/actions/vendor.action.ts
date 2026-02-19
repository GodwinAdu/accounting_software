"use server"

import { revalidatePath } from "next/cache"
import Vendor, { IVendor } from "@/lib/models/vendor.model"
import { checkPermission } from "@/lib/helpers/check-permission"
import { checkWriteAccess } from "@/lib/helpers/check-write-access"
import { connectToDB } from "../connection/mongoose"
import { withAuth, type User } from "../helpers/auth"
import { logAudit } from "../helpers/audit"

// Create Vendor
async function _createVendor(
  user: User,
  data: Partial<IVendor>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("vendors_create")
    if (!hasPermission) {
      return { error: "You don't have permission to create vendors" }
    }

    await connectToDB()

    // Generate vendor number
    const vendorNumber = `VEN-${Date.now().toString().slice(-6)}`

    const vendor = await Vendor.create({
      ...data,
      vendorNumber,
      organizationId: user.organizationId,
      createdBy: user._id,
      mod_flag: false,
      del_flag: false
    })

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "vendor",
      resourceId: String(vendor._id),
      details: { after: vendor },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(vendor)) }
  } catch (error: any) {
    console.error("Create vendor error:", error)
    return { error: error.message || "Failed to create vendor" }
  }
}

export const createVendor = await withAuth(_createVendor)

// Get Vendors
async function _getVendors(user: User) {
  try {
    const hasPermission = await checkPermission("vendors_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view vendors" }
    }

    await connectToDB()

    const vendors = await Vendor.find({
      organizationId: user.organizationId,
      del_flag: false
    })
      .sort({ createdAt: -1 })
      .lean()

    return { success: true, data: JSON.parse(JSON.stringify(vendors)) }
  } catch (error: any) {
    console.error("Get vendors error:", error)
    return { error: error.message || "Failed to fetch vendors" }
  }
}

export const getVendors = await withAuth(_getVendors)

// Get Vendor by ID
async function _getVendorById(user: User, vendorId: string) {
  try {
    const hasPermission = await checkPermission("vendors_view")
    if (!hasPermission) {
      return { error: "You don't have permission to view vendors" }
    }

    await connectToDB()

    const vendor = await Vendor.findOne({
      _id: vendorId,
      organizationId: user.organizationId,
      del_flag: false
    }).lean()

    if (!vendor) {
      return { error: "Vendor not found" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(vendor)) }
  } catch (error: any) {
    console.error("Get vendor error:", error)
    return { error: error.message || "Failed to fetch vendor" }
  }
}

export const getVendorById = await withAuth(_getVendorById)

// Update Vendor
async function _updateVendor(
  user: User,
  vendorId: string,
  data: Partial<IVendor>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("vendors_update")
    if (!hasPermission) {
      return { error: "You don't have permission to update vendors" }
    }

    await connectToDB()

    const oldVendor = await Vendor.findOne({
      _id: vendorId,
      organizationId: user.organizationId,
      del_flag: false
    })

    if (!oldVendor) {
      return { error: "Vendor not found" }
    }

    const vendor = await Vendor.findOneAndUpdate(
      {
        _id: vendorId,
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

    if (!vendor) {
      return { error: "Vendor not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "vendor",
      resourceId: String(vendorId),
      details: { before: oldVendor, after: vendor },
    })

    revalidatePath(path)
    return { success: true, data: JSON.parse(JSON.stringify(vendor)) }
  } catch (error: any) {
    console.error("Update vendor error:", error)
    return { error: error.message || "Failed to update vendor" }
  }
}

export const updateVendor = await withAuth(_updateVendor)

// Delete Vendor
async function _deleteVendor(
  user: User,
  vendorId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("vendors_delete")
    if (!hasPermission) {
      return { error: "You don't have permission to delete vendors" }
    }

    await connectToDB()

    const vendor = await Vendor.findOneAndUpdate(
      {
        _id: vendorId,
        organizationId: user.organizationId,
        del_flag: false
      },
      {
        del_flag: true,
        deletedBy: user.id
      },
      { new: true }
    )

    if (!vendor) {
      return { error: "Vendor not found" }
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "vendor",
      resourceId: String(vendorId),
      details: { before: vendor },
    })

    revalidatePath(path)
    return { success: true }
  } catch (error: any) {
    console.error("Delete vendor error:", error)
    return { error: error.message || "Failed to delete vendor" }
  }
}

export const deleteVendor = await withAuth(_deleteVendor)
