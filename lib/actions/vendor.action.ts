"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import Vendor from "../models/vendor.model";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";
import { checkPermission } from "../helpers/check-permission";

async function _createVendor(user: User, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    if (!await checkPermission("vendors_create")) {
      return { success: false, error: "Permission denied" };
    }
    
    await connectToDB();

    const lastVendor = await Vendor.findOne({ organizationId: user.organizationId })
      .sort({ createdAt: -1 })
      .lean();
    
    const vendorNumber = data.vendorNumber || `VEN-${String((lastVendor ? parseInt(lastVendor.vendorNumber.split('-')[1]) : 0) + 1).padStart(5, '0')}`;

    const vendor = await Vendor.create({
      ...data,
      vendorNumber,
      organizationId: user.organizationId,
      createdBy: user._id,
      mod_flag: false,
      del_flag: false
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "create",
      resource: "vendor",
      resourceId: String(vendor._id),
      details: { after: vendor },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(vendor)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getVendors(user: User) {
  try {
    await connectToDB();

    const vendors = await Vendor.find({
      organizationId: user.organizationId,
      del_flag: false
    })
      .sort({ companyName: 1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(vendors)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getVendorById(user: User, vendorId: string) {
  try {
    await connectToDB();

    const vendor = await Vendor.findOne({
      _id: vendorId,
      organizationId: user.organizationId,
      del_flag: false
    }).lean();

    if (!vendor) {
      return { error: "Vendor not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(vendor)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateVendor(user: User, vendorId: string, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    if (!await checkPermission("vendors_update")) {
      return { success: false, error: "Permission denied" };
    }
    
    await connectToDB();

    const oldVendor = await Vendor.findOne({
      _id: vendorId,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!oldVendor) {
      return { error: "Vendor not found" };
    }

    const vendor = await Vendor.findOneAndUpdate(
      { _id: vendorId, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "update",
      resource: "vendor",
      resourceId: String(vendorId),
      details: { before: oldVendor, after: vendor },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(vendor)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteVendor(user: User, vendorId: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    if (!await checkPermission("vendors_delete")) {
      return { success: false, error: "Permission denied" };
    }
    
    await connectToDB();

    const vendor = await Vendor.findOneAndUpdate(
      { _id: vendorId, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id, status: "inactive" },
      { new: true }
    );

    if (!vendor) {
      return { error: "Vendor not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id),
      action: "delete",
      resource: "vendor",
      resourceId: String(vendorId),
      details: { before: vendor },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createVendor = await withAuth(_createVendor);
export const getVendors = await withAuth(_getVendors);
export const getVendorById = await withAuth(_getVendorById);
export const updateVendor = await withAuth(_updateVendor);
export const deleteVendor = await withAuth(_deleteVendor);
