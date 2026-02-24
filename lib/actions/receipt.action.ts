"use server";

import { revalidatePath } from "next/cache";
import Receipt, { IReceipt } from "@/lib/models/receipt.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { postReceiptToGL } from "../helpers/sales-accounting";

async function _createReceipt(user: User, data: Partial<IReceipt>, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("salesReceipts_create");
    if (!hasPermission) {
      return { error: "You don't have permission to create receipts" };
    }

    await connectToDB();
    const receiptNumber = `REC-${Date.now().toString().slice(-6)}`;

    const receipt = await Receipt.create({
      ...data,
      receiptNumber,
      organizationId: user.organizationId,
      createdBy: user._id,
      mod_flag: false,
      del_flag: false,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "receipt",
      resourceId: String(receipt._id),
      details: { after: receipt },
    });

    // Post to GL
    await postReceiptToGL(String(receipt._id), String(user._id));

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(receipt)) };
  } catch (error: any) {
    console.error("Create receipt error:", error);
    return { error: error.message || "Failed to create receipt" };
  }
}

export const createReceipt = await withAuth(_createReceipt);

async function _getReceipts(user: User) {
  try {
    const hasPermission = await checkPermission("salesReceipts_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view receipts" };
    }

    await connectToDB();

    const receipts = await Receipt.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("customerId", "name email company")
      .populate("paymentId", "paymentNumber amount")
      .sort({ receiptDate: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(receipts)) };
  } catch (error: any) {
    console.error("Get receipts error:", error);
    return { error: error.message || "Failed to fetch receipts" };
  }
}

export const getReceipts = await withAuth(_getReceipts);

async function _getReceiptById(user: User, receiptId: string) {
  try {
    const hasPermission = await checkPermission("salesReceipts_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view receipts" };
    }

    await connectToDB();

    const receipt = await Receipt.findOne({
      _id: receiptId,
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("customerId", "name email company phone")
      .populate("paymentId", "paymentNumber amount paymentMethod")
      .lean();

    if (!receipt) {
      return { error: "Receipt not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(receipt)) };
  } catch (error: any) {
    console.error("Get receipt error:", error);
    return { error: error.message || "Failed to fetch receipt" };
  }
}

export const getReceiptById = await withAuth(_getReceiptById);

async function _updateReceipt(user: User, receiptId: string, data: Partial<IReceipt>, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("salesReceipts_update");
    if (!hasPermission) {
      return { error: "You don't have permission to update receipts" };
    }

    await connectToDB();

    const oldReceipt = await Receipt.findOne({
      _id: receiptId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!oldReceipt) {
      return { error: "Receipt not found" };
    }

    const receipt = await Receipt.findOneAndUpdate(
      {
        _id: receiptId,
        organizationId: user.organizationId,
        del_flag: false,
      },
      {
        ...data,
        modifiedBy: user._id,
        mod_flag: true,
      },
      { new: true }
    );

    if (!receipt) {
      return { error: "Receipt not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "receipt",
      resourceId: String(receiptId),
      details: { before: oldReceipt, after: receipt },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(receipt)) };
  } catch (error: any) {
    console.error("Update receipt error:", error);
    return { error: error.message || "Failed to update receipt" };
  }
}

export const updateReceipt = await withAuth(_updateReceipt);

async function _deleteReceipt(user: User, receiptId: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("salesReceipts_delete");
    if (!hasPermission) {
      return { error: "You don't have permission to delete receipts" };
    }

    await connectToDB();

    const receipt = await Receipt.findOneAndUpdate(
      {
        _id: receiptId,
        organizationId: user.organizationId,
        del_flag: false,
      },
      {
        del_flag: true,
        deletedBy: user._id,
      },
      { new: true }
    );

    if (!receipt) {
      return { error: "Receipt not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "receipt",
      resourceId: String(receiptId),
      details: { before: receipt },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    console.error("Delete receipt error:", error);
    return { error: error.message || "Failed to delete receipt" };
  }
}

export const deleteReceipt = await withAuth(_deleteReceipt);
