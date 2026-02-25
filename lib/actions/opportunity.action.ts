"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Opportunity from "@/lib/models/opportunity.model";
import { withAuth } from "@/lib/helpers/auth";
import { revalidatePath } from "next/cache";

async function _createOpportunity(user: any, data: {
  name: string;
  customerId?: string;
  leadId?: string;
  amount: number;
  probability?: number;
  expectedCloseDate: Date;
  source?: string;
  description?: string;
}) {
  try {
    await connectToDB();

    const count = await Opportunity.countDocuments({ organizationId: user.organizationId });
    const opportunityNumber = `OPP-${String(count + 1).padStart(5, "0")}`;

    const opportunity = await Opportunity.create({
      ...data,
      opportunityNumber,
      organizationId: user.organizationId,
      stage: "prospecting",
      probability: data.probability || 50,
      assignedTo: user._id,
      del_flag: false,
      createdBy: user._id,
      mod_flag: false,
    });

    revalidatePath("/dashboard/crm/opportunities");
    return { success: true, opportunity: JSON.parse(JSON.stringify(opportunity)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const createOpportunity = await withAuth(_createOpportunity);

async function _getAllOpportunities(user: any) {
  try {
    await connectToDB();

    const opportunities = await Opportunity.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("customerId", "name email company")
      .populate("leadId", "name email")
      .sort({ createdAt: -1 });

    return { success: true, opportunities: JSON.parse(JSON.stringify(opportunities)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const getAllOpportunities = await withAuth(_getAllOpportunities);

async function _updateOpportunityStage(user: any, opportunityId: string, stage: string) {
  try {
    await connectToDB();

    const updateData: any = {
      stage,
      modifiedBy: user._id,
      mod_flag: true,
    };

    if (stage === "closed_won" || stage === "closed_lost") {
      updateData.actualCloseDate = new Date();
    }

    const opportunity = await Opportunity.findOneAndUpdate(
      { _id: opportunityId, organizationId: user.organizationId, del_flag: false },
      updateData,
      { new: true }
    );

    if (!opportunity) throw new Error("Opportunity not found");

    revalidatePath("/dashboard/crm/opportunities");
    return { success: true, opportunity: JSON.parse(JSON.stringify(opportunity)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const updateOpportunityStage = await withAuth(_updateOpportunityStage);

async function _updateOpportunity(user: any, opportunityId: string, data: any) {
  try {
    await connectToDB();

    const opportunity = await Opportunity.findOneAndUpdate(
      { _id: opportunityId, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!opportunity) throw new Error("Opportunity not found");

    revalidatePath("/dashboard/crm/opportunities");
    return { success: true, opportunity: JSON.parse(JSON.stringify(opportunity)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const updateOpportunity = await withAuth(_updateOpportunity);

async function _deleteOpportunity(user: any, opportunityId: string) {
  try {
    await connectToDB();

    await Opportunity.findOneAndUpdate(
      { _id: opportunityId, organizationId: user.organizationId },
      { del_flag: true, modifiedBy: user._id, mod_flag: true }
    );

    revalidatePath("/dashboard/crm/opportunities");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const deleteOpportunity = await withAuth(_deleteOpportunity);

export const getOpportunities = getAllOpportunities;
