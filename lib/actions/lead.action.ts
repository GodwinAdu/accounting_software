"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Lead from "@/lib/models/lead.model";
import { withAuth } from "@/lib/helpers/auth";
import { revalidatePath } from "next/cache";

async function _createLead(user: any, data: {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  industry?: string;
  source?: string;
  status?: string;
  rating?: string;
  value?: number;
  notes?: string;
}) {
  try {
    await connectToDB();

    const count = await Lead.countDocuments({ organizationId: user.organizationId });
    const leadNumber = `LEAD-${String(count + 1).padStart(5, "0")}`;

    const lead = await Lead.create({
      ...data,
      leadNumber,
      organizationId: user.organizationId,
      status: data.status || "new",
      rating: data.rating || "warm",
      assignedTo: user._id,
      del_flag: false,
      createdBy: user._id,
      mod_flag: false,
    });

    revalidatePath("/dashboard/crm/leads");
    return { success: true, lead: JSON.parse(JSON.stringify(lead)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const createLead = await withAuth(_createLead);

async function _getAllLeads(user: any) {
  try {
    await connectToDB();

    const leads = await Lead.find({ organizationId: user.organizationId, del_flag: false }).sort({ createdAt: -1 });
    return { success: true, leads: JSON.parse(JSON.stringify(leads)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const getAllLeads = await withAuth(_getAllLeads);

async function _updateLeadStatus(user: any, leadId: string, status: string) {
  try {
    await connectToDB();

    const lead = await Lead.findOneAndUpdate(
      { _id: leadId, organizationId: user.organizationId, del_flag: false },
      { status, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!lead) throw new Error("Lead not found");

    revalidatePath("/dashboard/crm/leads");
    return { success: true, lead: JSON.parse(JSON.stringify(lead)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const updateLeadStatus = await withAuth(_updateLeadStatus);

async function _updateLead(user: any, leadId: string, data: any) {
  try {
    await connectToDB();

    const lead = await Lead.findOneAndUpdate(
      { _id: leadId, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!lead) throw new Error("Lead not found");

    revalidatePath("/dashboard/crm/leads");
    return { success: true, lead: JSON.parse(JSON.stringify(lead)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const updateLead = await withAuth(_updateLead);

async function _deleteLead(user: any, leadId: string) {
  try {
    await connectToDB();

    await Lead.findOneAndUpdate(
      { _id: leadId, organizationId: user.organizationId },
      { del_flag: true, modifiedBy: user._id, mod_flag: true }
    );

    revalidatePath("/dashboard/crm/leads");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const deleteLead = await withAuth(_deleteLead);

export const getLeads = getAllLeads;
