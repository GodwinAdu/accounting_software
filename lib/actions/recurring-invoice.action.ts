"use server";

import { revalidatePath } from "next/cache";
import RecurringInvoice, { IRecurringInvoice } from "@/lib/models/recurring-invoice.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";

async function _createRecurringInvoice(user: User, data: Partial<IRecurringInvoice>, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("recurringInvoices_create");
    if (!hasPermission) {
      return { error: "You don't have permission to create recurring invoices" };
    }

    await connectToDB();

    const recurringInvoice = await RecurringInvoice.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id,
      mod_flag: false,
      del_flag: false,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "recurring_invoice",
      resourceId: String(recurringInvoice._id),
      details: { after: recurringInvoice },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(recurringInvoice)) };
  } catch (error: any) {
    console.error("Create recurring invoice error:", error);
    return { error: error.message || "Failed to create recurring invoice" };
  }
}

export const createRecurringInvoice = await withAuth(_createRecurringInvoice);

async function _getRecurringInvoices(user: User) {
  try {
    const hasPermission = await checkPermission("recurringInvoices_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view recurring invoices" };
    }

    await connectToDB();

    const recurringInvoices = await RecurringInvoice.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("customerId", "name email company")
      .sort({ nextDate: 1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(recurringInvoices)) };
  } catch (error: any) {
    console.error("Get recurring invoices error:", error);
    return { error: error.message || "Failed to fetch recurring invoices" };
  }
}

export const getRecurringInvoices = await withAuth(_getRecurringInvoices);

async function _getRecurringInvoiceById(user: User, invoiceId: string) {
  try {
    const hasPermission = await checkPermission("recurringInvoices_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view recurring invoices" };
    }

    await connectToDB();

    const recurringInvoice = await RecurringInvoice.findOne({
      _id: invoiceId,
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("customerId", "name email company phone")
      .lean();

    if (!recurringInvoice) {
      return { error: "Recurring invoice not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(recurringInvoice)) };
  } catch (error: any) {
    console.error("Get recurring invoice error:", error);
    return { error: error.message || "Failed to fetch recurring invoice" };
  }
}

export const getRecurringInvoiceById = await withAuth(_getRecurringInvoiceById);

async function _updateRecurringInvoice(user: User, invoiceId: string, data: Partial<IRecurringInvoice>, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("recurringInvoices_update");
    if (!hasPermission) {
      return { error: "You don't have permission to update recurring invoices" };
    }

    await connectToDB();

    const oldRecurringInvoice = await RecurringInvoice.findOne({
      _id: invoiceId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!oldRecurringInvoice) {
      return { error: "Recurring invoice not found" };
    }

    const recurringInvoice = await RecurringInvoice.findOneAndUpdate(
      {
        _id: invoiceId,
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

    if (!recurringInvoice) {
      return { error: "Recurring invoice not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "recurring_invoice",
      resourceId: String(invoiceId),
      details: { before: oldRecurringInvoice, after: recurringInvoice },
    });

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(recurringInvoice)) };
  } catch (error: any) {
    console.error("Update recurring invoice error:", error);
    return { error: error.message || "Failed to update recurring invoice" };
  }
}

export const updateRecurringInvoice = await withAuth(_updateRecurringInvoice);

async function _deleteRecurringInvoice(user: User, invoiceId: string, path: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("recurringInvoices_delete");
    if (!hasPermission) {
      return { error: "You don't have permission to delete recurring invoices" };
    }

    await connectToDB();

    const recurringInvoice = await RecurringInvoice.findOneAndUpdate(
      {
        _id: invoiceId,
        organizationId: user.organizationId,
        del_flag: false,
      },
      {
        del_flag: true,
        deletedBy: user._id,
      },
      { new: true }
    );

    if (!recurringInvoice) {
      return { error: "Recurring invoice not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "recurring_invoice",
      resourceId: String(invoiceId),
      details: { before: recurringInvoice },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    console.error("Delete recurring invoice error:", error);
    return { error: error.message || "Failed to delete recurring invoice" };
  }
}

export const deleteRecurringInvoice = await withAuth(_deleteRecurringInvoice);
