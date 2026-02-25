"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Opportunity from "@/lib/models/opportunity.model";
import Invoice from "@/lib/models/invoice.model";
import { withAuth } from "@/lib/helpers/auth";
import { revalidatePath } from "next/cache";

async function _convertOpportunityToInvoice(user: any, opportunityId: string, invoiceData: {
  dueDate: Date;
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    taxRate?: number;
  }>;
  notes?: string;
  terms?: string;
}) {
  try {
    await connectToDB();

    const opportunity = await Opportunity.findOne({
      _id: opportunityId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!opportunity) throw new Error("Opportunity not found");
    if (!opportunity.customerId) throw new Error("Opportunity must have a customer");
    if (opportunity.stage !== "closed_won") throw new Error("Only won opportunities can be converted to invoices");

    const invoiceCount = await Invoice.countDocuments({ organizationId: user.organizationId });
    const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(5, "0")}`;

    const lineItems = invoiceData.lineItems.map((item) => {
      const amount = item.quantity * item.rate;
      const taxRate = item.taxRate || 0;
      const taxAmount = amount * (taxRate / 100);
      return {
        ...item,
        amount,
        taxRate,
        taxAmount,
      };
    });

    const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const totalTax = lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const total = subtotal + totalTax;

    const invoice = await Invoice.create({
      organizationId: user.organizationId,
      invoiceNumber,
      customerId: opportunity.customerId,
      issueDate: new Date(),
      dueDate: invoiceData.dueDate,
      lineItems,
      subtotal,
      taxAmount: totalTax,
      total,
      status: "draft",
      notes: invoiceData.notes || `Invoice for ${opportunity.name}`,
      terms: invoiceData.terms,
      del_flag: false,
      createdBy: user._id,
      mod_flag: false,
    });

    await Opportunity.findByIdAndUpdate(opportunityId, {
      modifiedBy: user._id,
      mod_flag: true,
    });

    revalidatePath("/dashboard/crm/opportunities");
    revalidatePath("/dashboard/sales/invoices");
    return { success: true, invoice: JSON.parse(JSON.stringify(invoice)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const convertOpportunityToInvoice = await withAuth(_convertOpportunityToInvoice);
