"use server";

import { revalidatePath } from "next/cache";
import PortalSettings from "@/lib/models/portal-settings.model";
import Customer from "@/lib/models/customer.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";

async function _getPortalSettings(user: User) {
  try {
    const hasPermission = await checkPermission("customerPortal_view");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    let settings = await PortalSettings.findOne({ organizationId: user.organizationId });

    if (!settings) {
      settings = await PortalSettings.create({ organizationId: user.organizationId });
    }

    const customers = await Customer.find({ organizationId: user.organizationId, del_flag: false, status: "active" });
    const activeCustomers = customers.length;

    return {
      success: true,
      data: {
        ...JSON.parse(JSON.stringify(settings)),
        activeCustomers,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updatePortalSettings(user: User, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("customerPortal_update");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const settings = await PortalSettings.findOneAndUpdate(
      { organizationId: user.organizationId },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true, upsert: true }
    );

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "portal-settings",
      resourceId: String(settings._id),
      details: { after: settings },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(settings)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getPortalSettings = await withAuth(_getPortalSettings);
export const updatePortalSettings = await withAuth(_updatePortalSettings);
