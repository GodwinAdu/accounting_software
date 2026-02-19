"use server";

import { revalidatePath } from "next/cache";
import BankRule from "@/lib/models/bank-rule.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";

async function _createBankRule(user: User, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("bankRules_create");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const rule = await BankRule.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "bank-rule",
      resourceId: String(rule._id),
      details: { after: rule },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(rule)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getBankRules(user: User) {
  try {
    const hasPermission = await checkPermission("bankRules_view");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const rules = await BankRule.find({ organizationId: user.organizationId, del_flag: false }).sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(rules)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateBankRule(user: User, id: string, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("bankRules_update");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const rule = await BankRule.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!rule) return { error: "Rule not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "bank-rule",
      resourceId: id,
      details: { after: rule },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(rule)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteBankRule(user: User, id: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("bankRules_delete");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const rule = await BankRule.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!rule) return { error: "Rule not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "bank-rule",
      resourceId: id,
      details: { before: rule },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createBankRule = await withAuth(_createBankRule);
export const getBankRules = await withAuth(_getBankRules);
export const updateBankRule = await withAuth(_updateBankRule);
export const deleteBankRule = await withAuth(_deleteBankRule);
