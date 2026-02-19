"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import EmailCampaign from "../models/email-campaign.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createEmailCampaign(user: any, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const campaign = await EmailCampaign.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "email_campaign",
      resourceId: String(campaign._id),
      details: { after: campaign },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(campaign)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getEmailCampaigns(user: any) {
  try {
    await connectToDB();

    const campaigns = await EmailCampaign.find({
      organizationId: user.organizationId,
      del_flag: false,
    }).sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(campaigns)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getEmailCampaignById(user: any, id: string) {
  try {
    await connectToDB();

    const campaign = await EmailCampaign.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!campaign) {
      return { error: "Campaign not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(campaign)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateEmailCampaign(user: any, id: string, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const oldCampaign = await EmailCampaign.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!oldCampaign) {
      return { error: "Campaign not found" };
    }

    const campaign = await EmailCampaign.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: { $inc: 1 } },
      { new: true }
    );

    if (!campaign) {
      return { error: "Campaign not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "email_campaign",
      resourceId: String(id),
      details: { before: oldCampaign, after: campaign },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(campaign)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteEmailCampaign(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const campaign = await EmailCampaign.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!campaign) {
      return { error: "Campaign not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "email_campaign",
      resourceId: String(id),
      details: { before: campaign },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _sendEmailCampaign(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const campaign = await EmailCampaign.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
      status: "draft",
    });

    if (!campaign) {
      return { error: "Campaign not found or already sent" };
    }

    // Get organization settings
    const Organization = (await import("../models/organization.model")).default;
    const organization = await Organization.findById(user.organizationId);

    // Collect email addresses
    let emails: string[] = [];
    
    if (campaign.recipients.type === "custom" && campaign.recipients.emails) {
      emails = campaign.recipients.emails;
    } else if (campaign.recipients.type === "customers" && campaign.recipients.customerIds) {
      const Customer = (await import("../models/customer.model")).default;
      const customers = await Customer.find({ _id: { $in: campaign.recipients.customerIds } }).select("email");
      emails = customers.map((c: any) => c.email).filter(Boolean);
    } else if (campaign.recipients.type === "employees" && campaign.recipients.employeeIds) {
      const Employee = (await import("../models/employee.model")).default;
      const employees = await Employee.find({ _id: { $in: campaign.recipients.employeeIds } }).populate("userId", "email");
      emails = employees.map((e: any) => e.userId?.email).filter(Boolean);
    } else if (campaign.recipients.type === "all") {
      const Customer = (await import("../models/customer.model")).default;
      const Employee = (await import("../models/employee.model")).default;
      const customers = await Customer.find({ organizationId: user.organizationId, del_flag: false }).select("email");
      const employees = await Employee.find({ organizationId: user.organizationId, del_flag: false }).populate("userId", "email");
      emails = [
        ...customers.map((c: any) => c.email),
        ...employees.map((e: any) => e.userId?.email),
      ].filter(Boolean);
    }

    if (emails.length === 0) {
      return { error: "No recipients found" };
    }

    // Send emails
    const { sendEmail } = await import("../../services/email-config");
    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      try {
        await sendEmail({
          to: [email],
          subject: campaign.subject,
          html: campaign.content,
          organization: organization,
        });
        sent++;
      } catch (error) {
        failed++;
      }
    }

    // Update campaign
    const updatedCampaign = await EmailCampaign.findByIdAndUpdate(
      id,
      {
        status: "sent",
        sentAt: new Date(),
        "stats.sent": sent,
        "stats.delivered": sent,
        "stats.failed": failed,
        modifiedBy: user._id,
        $inc: { mod_flag: 1 },
      },
      { new: true }
    );

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(updatedCampaign)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createEmailCampaign = await withAuth(_createEmailCampaign);
export const getEmailCampaigns = await withAuth(_getEmailCampaigns);
export const getEmailCampaignById = await withAuth(_getEmailCampaignById);
export const updateEmailCampaign = await withAuth(_updateEmailCampaign);
export const deleteEmailCampaign = await withAuth(_deleteEmailCampaign);
export const sendEmailCampaign = await withAuth(_sendEmailCampaign);
