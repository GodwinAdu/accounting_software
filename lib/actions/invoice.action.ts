"use server";

import { revalidatePath } from "next/cache";
import Invoice, { IInvoice } from "@/lib/models/invoice.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { checkWriteAccess } from "@/lib/helpers/check-write-access";
import { connectToDB } from "../connection/mongoose";
import { withAuth, type User } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { postInvoiceToGL } from "../helpers/sales-accounting";

// Create Invoice
async function _createInvoice(
  user: User,
  data: Partial<IInvoice>,
  path: string
) {
  try {
    if(!user) throw new Error("User not authenticated")
    
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("invoices_create");
    if (!hasPermission) {
      return { error: "You don't have permission to create invoices" };
    }

    await connectToDB();

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    // Clean up empty string ObjectIds
    const cleanData = {
      ...data,
      revenueAccountId: data.revenueAccountId || undefined,
      receivableAccountId: data.receivableAccountId || undefined,
      taxAccountId: data.taxAccountId || undefined,
      projectId: data.projectId || undefined,
    };

    const invoice = await Invoice.create({
      ...cleanData,
      invoiceNumber,
      organizationId: user.organizationId,
      createdBy: user._id,
      mod_flag: false,
      del_flag: false,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "invoice",
      resourceId: String(invoice._id),
      details: { after: invoice },
    });

    // Auto-post to GL if status is 'sent' or 'paid'
    if (data.status === "sent" || data.status === "paid") {
      await postInvoiceToGL(String(invoice._id), String(user._id));
    }

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(invoice)) };
  } catch (error: any) {
    console.error("Create invoice error:", error);
    return { error: error.message || "Failed to create invoice" };
  }
}

export const createInvoice = await withAuth(_createInvoice);

// Get Invoices
async function _getInvoices(user: User) {
  try {
    const hasPermission = await checkPermission("invoices_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view invoices" };
    }

    await connectToDB();

    const invoices = await Invoice.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("customerId", "name email company")
      .sort({ invoiceDate: -1 })
      .lean();

    return { success: true, data: JSON.parse(JSON.stringify(invoices)) };
  } catch (error: any) {
    console.error("Get invoices error:", error);
    return { error: error.message || "Failed to fetch invoices" };
  }
}

export const getInvoices = await withAuth(_getInvoices);

// Get Invoice Summary
async function _getInvoiceSummary(user: User) {
  try {
    const hasPermission = await checkPermission("invoices_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view invoices" };
    }

    await connectToDB();

    const invoices = await Invoice.find({
      organizationId: user.organizationId,
      del_flag: false,
    }).lean();

    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paidAmount = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const outstanding = totalAmount - paidAmount;
    const overdue = invoices.filter(inv => inv.status === "overdue").length;

    return {
      success: true,
      data: { totalInvoices, totalAmount, paidAmount, outstanding, overdue },
    };
  } catch (error: any) {
    console.error("Get invoice summary error:", error);
    return { error: error.message || "Failed to fetch invoice summary" };
  }
}

export const getInvoiceSummary = await withAuth(_getInvoiceSummary);

// Get Invoice by ID
async function _getInvoiceById(user: User, invoiceId: string) {
  try {
    const hasPermission = await checkPermission("invoices_view");
    if (!hasPermission) {
      return { error: "You don't have permission to view invoices" };
    }

    await connectToDB();

    const invoice = await Invoice.findOne({
      _id: invoiceId,
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("customerId", "name email company phone")
      .lean();

    if (!invoice) {
      return { error: "Invoice not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(invoice)) };
  } catch (error: any) {
    console.error("Get invoice error:", error);
    return { error: error.message || "Failed to fetch invoice" };
  }
}

export const getInvoiceById = await withAuth(_getInvoiceById);

// Update Invoice
async function _updateInvoice(
  user: User,
  invoiceId: string,
  data: Partial<IInvoice>,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("invoices_update");
    if (!hasPermission) {
      return { error: "You don't have permission to update invoices" };
    }

    await connectToDB();

    const oldInvoice = await Invoice.findOne({
      _id: invoiceId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!oldInvoice) {
      return { error: "Invoice not found" };
    }

    const invoice = await Invoice.findOneAndUpdate(
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

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "invoice",
      resourceId: String(invoiceId),
      details: { before: oldInvoice, after: invoice },
    });

    // Post to GL if status changed to 'sent' or 'paid'
    if ((data.status === "sent" || data.status === "paid") && oldInvoice.status === "draft") {
      await postInvoiceToGL(String(invoiceId), String(user._id));
    }

    revalidatePath(path);
    return { success: true, data: JSON.parse(JSON.stringify(invoice)) };
  } catch (error: any) {
    console.error("Update invoice error:", error);
    return { error: error.message || "Failed to update invoice" };
  }
}

export const updateInvoice = await withAuth(_updateInvoice);

// Delete Invoice
async function _deleteInvoice(
  user: User,
  invoiceId: string,
  path: string
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    const hasPermission = await checkPermission("invoices_delete");
    if (!hasPermission) {
      return { error: "You don't have permission to delete invoices" };
    }

    await connectToDB();

    const invoice = await Invoice.findOneAndUpdate(
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

    if (!invoice) {
      return { error: "Invoice not found" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "invoice",
      resourceId: String(invoiceId),
      details: { before: invoice },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error: any) {
    console.error("Delete invoice error:", error);
    return { error: error.message || "Failed to delete invoice" };
  }
}

export const deleteInvoice = await withAuth(_deleteInvoice);
