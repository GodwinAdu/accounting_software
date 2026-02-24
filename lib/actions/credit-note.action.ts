"use server";

import { revalidatePath } from "next/cache";
import CreditNote from "@/lib/models/credit-note.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { postCreditNoteToGL } from "../helpers/sales-accounting";

async function _createCreditNote(user: User, data: any, path: string) {
  try {
    if (!user) throw new Error("User not authorized")

    await checkWriteAccess(String(user.organizationId));

    const hasPermission = await checkPermission("creditNotes_create");

    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    
    const creditNoteNumber = `CN-${Date.now().toString().slice(-6)}`;

    const subtotal = data.items?.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0) || 0;
    const total = subtotal + (data.tax || 0);

    const creditNote = await CreditNote.create({
      ...data,
      creditNoteNumber,
      subtotal,
      total,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "credit-note",
      resourceId: String(creditNote._id),
      details: { after: creditNote },
    });

    console.log("Credit note created with status:", data.status);
    if (data.status === "issued" || data.status === "applied") {
      console.log("Posting credit note to GL...");
      const glResult = await postCreditNoteToGL(String(creditNote._id), String(user._id));
      console.log("GL posting result:", glResult);
    } else {
      console.log("Skipping GL posting - status is:", data.status);
    }

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(creditNote)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getCreditNotes(user: User) {
  try {
    const hasPermission = await checkPermission("creditNotes_view");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const creditNotes = await CreditNote.find({ organizationId: user.organizationId, del_flag: false })
      .populate("customerId", "name email")
      .populate("invoiceId", "invoiceNumber")
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(creditNotes)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getCreditNoteById(user: User, creditNoteId: string) {
  try {
    const hasPermission = await checkPermission("creditNotes_view");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const creditNote = await CreditNote.findOne({ _id: creditNoteId, organizationId: user.organizationId, del_flag: false })
      .populate("customerId", "name email company")
      .populate("invoiceId", "invoiceNumber")
      .lean();

    if (!creditNote) return { error: "Credit note not found" };

    return { success: true, data: JSON.parse(JSON.stringify(creditNote)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateCreditNote(user: User, id: string, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("creditNotes_update");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();

    const oldCreditNote = await CreditNote.findOne({ _id: id, organizationId: user.organizationId, del_flag: false });
    if (!oldCreditNote) return { error: "Credit note not found" };

    const subtotal = data.items?.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0) || 0;
    const total = subtotal + (data.tax || 0);

    const creditNote = await CreditNote.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, subtotal, total, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!creditNote) return { error: "Credit note not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "credit-note",
      resourceId: id,
      details: { before: oldCreditNote, after: creditNote },
    });

    if ((data.status === "issued" || data.status === "applied") && oldCreditNote.status === "draft") {
      await postCreditNoteToGL(id, String(user._id));
    }

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(creditNote)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteCreditNote(user: User, id: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("creditNotes_delete");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const creditNote = await CreditNote.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!creditNote) return { error: "Credit note not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "credit-note",
      resourceId: id,
      details: { before: creditNote },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createCreditNote = await withAuth(_createCreditNote);
export const getCreditNotes = await withAuth(_getCreditNotes);
export const getCreditNoteById = await withAuth(_getCreditNoteById);
export const updateCreditNote = await withAuth(_updateCreditNote);
export const deleteCreditNote = await withAuth(_deleteCreditNote);
