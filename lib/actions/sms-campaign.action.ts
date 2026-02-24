"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import SMSCampaign from "../models/sms-campaign.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createSMSCampaign(user: any, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const campaign = await SMSCampaign.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "sms_campaign",
      resourceId: String(campaign._id),
      details: { after: campaign },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(campaign)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getSMSCampaigns(user: any) {
  try {
    await connectToDB();

    const campaigns = await SMSCampaign.find({
      organizationId: user.organizationId,
      del_flag: false,
    }).sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(campaigns)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getSMSCampaignById(user: any, id: string) {
  try {
    await connectToDB();

    const campaign = await SMSCampaign.findOne({
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

async function _updateSMSCampaign(user: any, id: string, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const oldCampaign = await SMSCampaign.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!oldCampaign) {
      return { error: "Campaign not found" };
    }

    const campaign = await SMSCampaign.findOneAndUpdate(
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
      resource: "sms_campaign",
      resourceId: String(id),
      details: { before: oldCampaign, after: campaign },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(campaign)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteSMSCampaign(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const campaign = await SMSCampaign.findOneAndUpdate(
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
      resource: "sms_campaign",
      resourceId: String(id),
      details: { before: campaign },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _sendSMSCampaign(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const campaign = await SMSCampaign.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
      status: "draft",
    });

    if (!campaign) {
      return { error: "Campaign not found or already sent" };
    }

    let phones: string[] = [];
    
    if (campaign.recipients.type === "custom" && campaign.recipients.phones) {
      phones = campaign.recipients.phones;
    } else if (campaign.recipients.type === "customers" && campaign.recipients.customerIds) {
      const Customer = (await import("../models/customer.model")).default;
      const customers = await Customer.find({ _id: { $in: campaign.recipients.customerIds } }).select("phone");
      phones = customers.map((c: any) => c.phone).filter(Boolean);
    } else if (campaign.recipients.type === "employees" && campaign.recipients.employeeIds) {
      const Employee = (await import("../models/employee.model")).default;
      const employees = await Employee.find({ _id: { $in: campaign.recipients.employeeIds } }).populate("userId", "phone");
      phones = employees.map((e: any) => e.userId?.phone).filter(Boolean);
    } else if (campaign.recipients.type === "all") {
      const Customer = (await import("../models/customer.model")).default;
      const Employee = (await import("../models/employee.model")).default;
      const customers = await Customer.find({ organizationId: user.organizationId, del_flag: false }).select("phone");
      const employees = await Employee.find({ organizationId: user.organizationId, del_flag: false }).populate("userId", "phone");
      phones = [
        ...customers.map((c: any) => c.phone),
        ...employees.map((e: any) => e.userId?.phone),
      ].filter(Boolean);
    }

    if (phones.length === 0) {
      return { error: "No recipients found" };
    }

    const { calculateSMSCredits } = await import("../utils/sms-credits");
    const creditsPerMessage = calculateSMSCredits(campaign.message);
    const totalCredits = phones.length * creditsPerMessage;

    const { deductSMSCredits } = await import("./sms-credit.action");
    const creditCheck = await deductSMSCredits(
      user,
      totalCredits,
      `SMS Campaign: ${campaign.name}`,
      String(campaign._id),
      phones.length
    );

    if (!creditCheck.success) {
      return { error: creditCheck.error || "Insufficient SMS credits" };
    }

    const { smsConfig } = await import("../../services/sms-config");
    let sent = 0;
    let failed = 0;

    try {
      await smsConfig({
        text: campaign.message,
        destinations: phones,
      });
      sent = phones.length;
    } catch (error) {
      failed = phones.length;
    }

    const updatedCampaign = await SMSCampaign.findByIdAndUpdate(
      id,
      {
        status: sent > 0 ? "sent" : "failed",
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

export const createSMSCampaign = await withAuth(_createSMSCampaign);
export const getSMSCampaigns = await withAuth(_getSMSCampaigns);
export const getSMSCampaignById = await withAuth(_getSMSCampaignById);
export const updateSMSCampaign = await withAuth(_updateSMSCampaign);
export const deleteSMSCampaign = await withAuth(_deleteSMSCampaign);
export const sendSMSCampaign = await withAuth(_sendSMSCampaign);
