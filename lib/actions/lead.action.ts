"use server";

import { revalidatePath } from "next/cache";
import Lead from "@/lib/models/lead.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";

async function _createLead(user: User, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("leads_create");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const leadNumber = `LEAD-${Date.now().toString().slice(-6)}`;

    const lead = await Lead.create({
      ...data,
      leadNumber,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "lead",
      resourceId: String(lead._id),
      details: { after: lead },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(lead)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getLeads(user: User) {
  try {
    const hasPermission = await checkPermission("leads_view");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const leads = await Lead.find({ organizationId: user.organizationId, del_flag: false })
      .populate("assignedTo", "fullName")
      .sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(leads)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateLead(user: User, id: string, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("leads_update");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const lead = await Lead.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!lead) return { error: "Lead not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "lead",
      resourceId: id,
      details: { after: lead },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(lead)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteLead(user: User, id: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("leads_delete");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const lead = await Lead.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!lead) return { error: "Lead not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "lead",
      resourceId: id,
      details: { before: lead },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createLead = await withAuth(_createLead);
export const getLeads = await withAuth(_getLeads);
export const updateLead = await withAuth(_updateLead);
export const deleteLead = await withAuth(_deleteLead);
