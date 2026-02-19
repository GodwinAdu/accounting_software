"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import Deduction from "../models/deduction.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createDeduction(user: any, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const deduction = await Deduction.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "deduction",
      resourceId: String(deduction._id),
      details: { after: deduction },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(deduction)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getDeductions(user: any) {
  try {
    await connectToDB();

    const deductions = await Deduction.find({
      organizationId: user.organizationId,
      del_flag: false,
    }).sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(deductions)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getDeductionById(user: any, id: string) {
  try {
    await connectToDB();

    const deduction = await Deduction.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!deduction) {
      return { error: "Deduction not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(deduction)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateDeduction(user: any, id: string, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const oldDeduction = await Deduction.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!oldDeduction) {
      return { error: "Deduction not found" };
    }

    const deduction = await Deduction.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, $inc: { mod_flag: 1 } },
      { new: true }
    );

    if (!deduction) {
      return { error: "Deduction not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "deduction",
      resourceId: String(id),
      details: { before: oldDeduction, after: deduction },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(deduction)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteDeduction(user: any, id: string, pathname: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const deduction = await Deduction.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!deduction) {
      return { error: "Deduction not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "deduction",
      resourceId: String(id),
      details: { before: deduction },
    });

    revalidatePath(pathname);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createDeduction = await withAuth(_createDeduction);
export const getDeductions = await withAuth(_getDeductions);
export const getDeductionById = await withAuth(_getDeductionById);
export const updateDeduction = await withAuth(_updateDeduction);
export const deleteDeduction = await withAuth(_deleteDeduction);
