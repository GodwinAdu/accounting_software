"use server";

import { revalidatePath } from "next/cache";
import Opportunity from "@/lib/models/opportunity.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";

async function _createOpportunity(user: User, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("opportunities_create");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const opportunityNumber = `OPP-${Date.now().toString().slice(-6)}`;

    const opportunity = await Opportunity.create({
      ...data,
      opportunityNumber,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "opportunity",
      resourceId: String(opportunity._id),
      details: { after: opportunity },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(opportunity)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getOpportunities(user: User) {
  try {
    const hasPermission = await checkPermission("opportunities_view");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const opportunities = await Opportunity.find({ organizationId: user.organizationId, del_flag: false })
      .populate("assignedTo", "fullName")
      .populate("contactId", "firstName lastName")
      .sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(opportunities)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateOpportunity(user: User, id: string, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("opportunities_update");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const opportunity = await Opportunity.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!opportunity) return { error: "Opportunity not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "opportunity",
      resourceId: id,
      details: { after: opportunity },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(opportunity)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteOpportunity(user: User, id: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("opportunities_delete");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const opportunity = await Opportunity.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!opportunity) return { error: "Opportunity not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "opportunity",
      resourceId: id,
      details: { before: opportunity },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createOpportunity = await withAuth(_createOpportunity);
export const getOpportunities = await withAuth(_getOpportunities);
export const updateOpportunity = await withAuth(_updateOpportunity);
export const deleteOpportunity = await withAuth(_deleteOpportunity);
