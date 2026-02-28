"use server";

import { connectToDB } from "../connection/mongoose";
import Organization from "../models/organization.model";
import User from "../models/user.model";
import { checkSuperAdmin } from "../helpers/check-super-admin";
import { revalidatePath } from "next/cache";

export async function updateOrganizationStatus(orgId: string, status: string) {
  try {
    await checkSuperAdmin();
    await connectToDB();

    await Organization.findByIdAndUpdate(orgId, { isActive: status === "active" });

    revalidatePath("/super-admin/organizations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrganizationPlan(orgId: string, plan: string) {
  try {
    await checkSuperAdmin();
    await connectToDB();

    await Organization.findByIdAndUpdate(orgId, { "subscriptionPlan.plan": plan });

    revalidatePath("/super-admin/organizations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleOrganizationModule(orgId: string, module: string, enabled: boolean) {
  try {
    await checkSuperAdmin();
    await connectToDB();

    await Organization.findByIdAndUpdate(orgId, { [`modules.${module}`]: enabled });

    revalidatePath("/super-admin/organizations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteOrganization(orgId: string) {
  try {
    await checkSuperAdmin();
    await connectToDB();

    await Organization.findByIdAndUpdate(orgId, { del_flag: true });
    await User.updateMany({ organizationId: orgId }, { del_flag: true });

    revalidatePath("/super-admin/organizations");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserStatus(userId: string, status: string) {
  try {
    await checkSuperAdmin();
    await connectToDB();

    await User.findByIdAndUpdate(userId, { status });

    revalidatePath("/super-admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPlatformStats() {
  try {
    await checkSuperAdmin();
    await connectToDB();

    const [totalOrgs, activeOrgs, totalUsers, activeUsers] = await Promise.all([
      Organization.countDocuments({ del_flag: false }),
      Organization.countDocuments({ del_flag: false, status: "active" }),
      User.countDocuments({ del_flag: false }),
      User.countDocuments({ del_flag: false, status: "active" }),
    ]);

    return {
      success: true,
      stats: { totalOrgs, activeOrgs, totalUsers, activeUsers },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createOrganization(data: any) {
  try {
    await checkSuperAdmin();
    await connectToDB();

    const org = await Organization.create(data);

    revalidatePath("/super-admin/organizations");
    return { success: true, data: org };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrganization(orgId: string, data: any) {
  try {
    await checkSuperAdmin();
    await connectToDB();

    await Organization.findByIdAndUpdate(orgId, data);

    revalidatePath("/super-admin/organizations");
    revalidatePath(`/super-admin/organizations/${orgId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function assignUserRole(userId: string, role: string) {
  try {
    await checkSuperAdmin();
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) return { success: false, error: "User not found" };

    user.role = role;
    await user.save();

    revalidatePath("/super-admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function removeUserRole(userId: string) {
  try {
    await checkSuperAdmin();
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) return { success: false, error: "User not found" };

    user.role = "user";
    await user.save();

    revalidatePath("/super-admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
