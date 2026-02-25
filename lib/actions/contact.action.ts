"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Contact from "@/lib/models/contact.model";
import { withAuth } from "@/lib/helpers/auth";
import { revalidatePath } from "next/cache";

async function _createContact(user: any, data: {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  jobTitle?: string;
  department?: string;
  isPrimary?: boolean;
  notes?: string;
}) {
  try {
    await connectToDB();

    const contact = await Contact.create({
      ...data,
      organizationId: user.organizationId,
      del_flag: false,
      createdBy: user._id,
      mod_flag: false,
    });

    revalidatePath("/dashboard/crm/contacts");
    return { success: true, contact: JSON.parse(JSON.stringify(contact)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const createContact = await withAuth(_createContact);

async function _getAllContacts(user: any) {
  try {
    await connectToDB();

    const contacts = await Contact.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("customerId", "name company")
      .sort({ createdAt: -1 });

    return { success: true, contacts: JSON.parse(JSON.stringify(contacts)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const getAllContacts = await withAuth(_getAllContacts);

async function _getContactsByCustomer(user: any, customerId: string) {
  try {
    await connectToDB();

    const contacts = await Contact.find({
      organizationId: user.organizationId,
      customerId,
      del_flag: false,
    }).sort({ isPrimary: -1, createdAt: -1 });

    return { success: true, contacts: JSON.parse(JSON.stringify(contacts)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const getContactsByCustomer = await withAuth(_getContactsByCustomer);

async function _updateContact(user: any, contactId: string, data: any) {
  try {
    await connectToDB();

    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: true },
      { new: true }
    );

    if (!contact) throw new Error("Contact not found");

    revalidatePath("/dashboard/crm/contacts");
    return { success: true, contact: JSON.parse(JSON.stringify(contact)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const updateContact = await withAuth(_updateContact);

async function _deleteContact(user: any, contactId: string) {
  try {
    await connectToDB();

    await Contact.findOneAndUpdate(
      { _id: contactId, organizationId: user.organizationId },
      { del_flag: true, modifiedBy: user._id, mod_flag: true }
    );

    revalidatePath("/dashboard/crm/contacts");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const deleteContact = await withAuth(_deleteContact);

export const getContacts = getAllContacts;
