"use server";

import { revalidatePath } from "next/cache";
import Contact from "@/lib/models/contact.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";

async function _createContact(user: User, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("contacts_create");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const contactNumber = `CONT-${Date.now().toString().slice(-6)}`;

    const contact = await Contact.create({
      ...data,
      contactNumber,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "contact",
      resourceId: String(contact._id),
      details: { after: contact },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(contact)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getContacts(user: User) {
  try {
    const hasPermission = await checkPermission("contacts_view");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const contacts = await Contact.find({ organizationId: user.organizationId, del_flag: false })
      .populate("assignedTo", "fullName")
      .sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(contacts)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateContact(user: User, id: string, data: any, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("contacts_update");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const contact = await Contact.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!contact) return { error: "Contact not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "contact",
      resourceId: id,
      details: { after: contact },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(contact)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteContact(user: User, id: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    const hasPermission = await checkPermission("contacts_delete");
    if (!hasPermission) return { error: "No permission" };

    await connectToDB();
    const contact = await Contact.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id },
      { new: true }
    );

    if (!contact) return { error: "Contact not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "contact",
      resourceId: id,
      details: { before: contact },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createContact = await withAuth(_createContact);
export const getContacts = await withAuth(_getContacts);
export const updateContact = await withAuth(_updateContact);
export const deleteContact = await withAuth(_deleteContact);
