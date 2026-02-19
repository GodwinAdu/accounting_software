"use server";

import { revalidatePath } from "next/cache";
import CreditNote from "@/lib/models/credit-note.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";

async function _createCreditNote(user: User, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("creditNotes_create");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const creditNoteNumber = `CN-${Date.now().toString().slice(-6)}`;

    const creditNote = await CreditNote.create({
      ...data,
      creditNoteNumber,
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
      .sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(creditNotes)) };
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
    const creditNote = await CreditNote.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!creditNote) return { error: "Credit note not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "credit-note",
      resourceId: id,
      details: { after: creditNote },
    });

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
export const updateCreditNote = await withAuth(_updateCreditNote);
export const deleteCreditNote = await withAuth(_deleteCreditNote);
