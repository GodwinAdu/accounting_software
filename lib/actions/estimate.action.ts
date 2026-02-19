"use server";

import { revalidatePath } from "next/cache";
import Estimate, { IEstimate } from "@/lib/models/estimate.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";

async function _createEstimate(user: User, data: Partial<IEstimate>, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("estimates_create");
    if (!hasPermission) {
      return { error: "You don't have permission to create estimates" };
    }

    await connectToDB();
    const estimateNumber = `EST-${Date.now().toString().slice(-6)}`;

    const estimate = await Estimate.create({
      ...data,
      estimateNumber,
      organizationId: user.organizationId,
      createdBy: user._id,
      mod_flag: false,
      del_flag: false,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "estimate",
      resourceId: String(estimate._id),
      details: { after: estimate },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(estimate)) };
  } catch (error: any) {
    console.error("Create estimate error:", error);
    return { error: error.message || "Failed to create estimate" };
  }
}

export const createEstimate = await withAuth(_createEstimate);

async function _getEstimates(user: User) {
  try {
    const hasPermission = await checkPermission("estimates_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view estimates" };
    }

    await connectToDB();

    const estimates = await Estimate.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("customerId", "name email company")
      .sort({ estimateDate: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(estimates)) };
  } catch (error: any) {
    console.error("Get estimates error:", error);
    return { error: error.message || "Failed to fetch estimates" };
  }
}

export const getEstimates = await withAuth(_getEstimates);

async function _getEstimateById(user: User, estimateId: string) {
  try {
    const hasPermission = await checkPermission("estimates_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view estimates" };
    }

    await connectToDB();

    const estimate = await Estimate.findOne({
      _id: estimateId,
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("customerId", "name email company phone")
      .lean();

    if (!estimate) {
      return { error: "Estimate not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(estimate)) };
  } catch (error: any) {
    console.error("Get estimate error:", error);
    return { error: error.message || "Failed to fetch estimate" };
  }
}

export const getEstimateById = await withAuth(_getEstimateById);

async function _updateEstimate(user: User, estimateId: string, data: Partial<IEstimate>, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("estimates_update");
    if (!hasPermission) {
      return { error: "You don't have permission to update estimates" };
    }

    await connectToDB();

    const oldEstimate = await Estimate.findOne({
      _id: estimateId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!oldEstimate) {
      return { error: "Estimate not found" };
    }

    const estimate = await Estimate.findOneAndUpdate(
      {
        _id: estimateId,
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

    if (!estimate) {
      return { error: "Estimate not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "estimate",
      resourceId: String(estimateId),
      details: { before: oldEstimate, after: estimate },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(estimate)) };
  } catch (error: any) {
    console.error("Update estimate error:", error);
    return { error: error.message || "Failed to update estimate" };
  }
}

export const updateEstimate = await withAuth(_updateEstimate);

async function _deleteEstimate(user: User, estimateId: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("estimates_delete");
    if (!hasPermission) {
      return { error: "You don't have permission to delete estimates" };
    }

    await connectToDB();

    const estimate = await Estimate.findOneAndUpdate(
      {
        _id: estimateId,
        organizationId: user.organizationId,
        del_flag: false,
      },
      {
        del_flag: true,
        deletedBy: user._id,
      },
      { new: true }
    );

    if (!estimate) {
      return { error: "Estimate not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "estimate",
      resourceId: String(estimateId),
      details: { before: estimate },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    console.error("Delete estimate error:", error);
    return { error: error.message || "Failed to delete estimate" };
  }
}

export const deleteEstimate = await withAuth(_deleteEstimate);
