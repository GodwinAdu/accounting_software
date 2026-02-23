"use server";

import { connectToDB } from "../connection/mongoose";
import RecurringInvoice from "../models/recurring-invoice.model";
import Invoice from "../models/invoice.model";
import { postInvoiceToGL } from "./sales-accounting";
import { logAudit } from "./audit";

/**
 * This function should be called by a cron job daily
 * to generate invoices from active recurring invoice profiles
 */
export async function processRecurringInvoices() {
  try {
    await connectToDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all active recurring invoices where nextDate is today or earlier
    const recurringInvoices = await RecurringInvoice.find({
      status: "active",
      nextDate: { $lte: today },
      del_flag: false,
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: today } }
      ]
    });

    console.log(`Found ${recurringInvoices.length} recurring invoices to process`);

    for (const recurring of recurringInvoices) {
      try {
        // Generate invoice
        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
        const dueDate = calculateDueDate(recurring.paymentTerms);

        const invoice = await Invoice.create({
          organizationId: recurring.organizationId,
          invoiceNumber,
          customerId: recurring.customerId,
          invoiceDate: new Date(),
          dueDate,
          lineItems: recurring.lineItems,
          subtotal: recurring.subtotal,
          taxRate: recurring.taxRate,
          taxAmount: recurring.taxAmount,
          totalAmount: recurring.totalAmount,
          paidAmount: 0,
          status: "sent",
          revenueAccountId: recurring.revenueAccountId,
          receivableAccountId: recurring.receivableAccountId,
          taxAccountId: recurring.taxAccountId,
          notes: recurring.notes,
          terms: recurring.terms,
          createdBy: recurring.createdBy,
          del_flag: false,
          mod_flag: false,
        });

        // Post to general ledger
        await postInvoiceToGL(String(invoice._id), String(recurring.createdBy));

        // Send email if autoSend is enabled
        if (recurring.autoSend) {
          const Customer = (await import("../models/customer.model")).default;
          const customer = await Customer.findById(recurring.customerId);
          if (customer?.email) {
            // TODO: Implement email sending
            console.log(`Auto-send: Would send invoice ${invoice.invoiceNumber} to ${customer.email}`);
          }
        }

        // Calculate next date
        const nextDate = calculateNextDate(recurring.nextDate, recurring.frequency);

        // Update recurring invoice
        await RecurringInvoice.findByIdAndUpdate(recurring._id, {
          nextDate,
          status: recurring.endDate && nextDate > recurring.endDate ? "completed" : "active"
        });

        await logAudit({
          organizationId: String(recurring.organizationId),
          userId: String(recurring.createdBy),
          action: "create",
          resource: "invoice",
          resourceId: String(invoice._id),
          details: { 
            generatedFrom: String(recurring._id),
            automated: true 
          },
        });

        console.log(`Generated invoice ${invoice.invoiceNumber} from recurring profile ${recurring.profileName}`);
      } catch (error) {
        console.error(`Error processing recurring invoice ${recurring._id}:`, error);
      }
    }

    return { success: true, processed: recurringInvoices.length };
  } catch (error: any) {
    console.error("Error processing recurring invoices:", error);
    return { error: error.message };
  }
}

function calculateNextDate(currentDate: Date, frequency: string): Date {
  const next = new Date(currentDate);
  
  switch (frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  
  return next;
}

function calculateDueDate(paymentTerms: string): Date {
  const dueDate = new Date();
  
  switch (paymentTerms) {
    case "net-15":
      dueDate.setDate(dueDate.getDate() + 15);
      break;
    case "net-30":
      dueDate.setDate(dueDate.getDate() + 30);
      break;
    case "net-45":
      dueDate.setDate(dueDate.getDate() + 45);
      break;
    case "net-60":
      dueDate.setDate(dueDate.getDate() + 60);
      break;
    case "due-on-receipt":
    default:
      // Due immediately
      break;
  }
  
  return dueDate;
}
