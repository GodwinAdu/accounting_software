"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Lead from "@/lib/models/lead.model";
import Customer from "@/lib/models/customer.model";
import Opportunity from "@/lib/models/opportunity.model";
import { withAuth } from "@/lib/helpers/auth";
import { revalidatePath } from "next/cache";

async function _convertLeadToCustomer(user: any, leadId: string) {
  try {
    await connectToDB();

    const lead = await Lead.findOne({
      _id: leadId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!lead) throw new Error("Lead not found");
    if (lead.status === "converted") throw new Error("Lead already converted");

    const existingCustomer = await Customer.findOne({
      organizationId: user.organizationId,
      email: lead.email,
      del_flag: false,
    });

    if (existingCustomer) {
      await Lead.findByIdAndUpdate(leadId, {
        status: "converted",
        convertedToCustomerId: existingCustomer._id,
        convertedAt: new Date(),
        modifiedBy: user._id,
        mod_flag: true,
      });

      revalidatePath("/dashboard/crm/leads");
      return { success: true, customer: JSON.parse(JSON.stringify(existingCustomer)) };
    }

    const customer = await Customer.create({
      organizationId: user.organizationId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company,
      status: "active",
      currency: "GHS",
      paymentTerms: "net-30",
      del_flag: false,
      createdBy: user._id,
      mod_flag: false,
    });

    await Lead.findByIdAndUpdate(leadId, {
      status: "converted",
      convertedToCustomerId: customer._id,
      convertedAt: new Date(),
      modifiedBy: user._id,
      mod_flag: true,
    });

    revalidatePath("/dashboard/crm/leads");
    return { success: true, customer: JSON.parse(JSON.stringify(customer)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const convertLeadToCustomer = await withAuth(_convertLeadToCustomer);

async function _createOpportunityFromLead(user: any, leadId: string, data: {
  name: string;
  amount: number;
  probability?: number;
  expectedCloseDate: Date;
  description?: string;
}) {
  try {
    await connectToDB();

    const lead = await Lead.findOne({
      _id: leadId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!lead) throw new Error("Lead not found");

    const count = await Opportunity.countDocuments({ organizationId: user.organizationId });
    const opportunityNumber = `OPP-${String(count + 1).padStart(5, "0")}`;

    const opportunity = await Opportunity.create({
      ...data,
      opportunityNumber,
      organizationId: user.organizationId,
      leadId: lead._id,
      customerId: lead.convertedToCustomerId,
      stage: "prospecting",
      probability: data.probability || 50,
      source: lead.source,
      assignedTo: lead.assignedTo || user._id,
      del_flag: false,
      createdBy: user._id,
      mod_flag: false,
    });

    revalidatePath("/dashboard/crm/leads");
    revalidatePath("/dashboard/crm/opportunities");
    return { success: true, opportunity: JSON.parse(JSON.stringify(opportunity)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const createOpportunityFromLead = await withAuth(_createOpportunityFromLead);
