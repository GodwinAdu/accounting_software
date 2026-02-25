"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Invoice from "@/lib/models/invoice.model";
import Expense from "@/lib/models/expense.model";
import { withAuth } from "@/lib/helpers/auth";
import { checkPermission } from "@/lib/helpers/check-permission";

async function _getProjectTransactions(user: any, projectId: string) {
  const hasPermission = await checkPermission("projects_view");
  if (!hasPermission) return { error: "Permission denied" };

  try {
    await connectToDB();

    const [invoices, expenses] = await Promise.all([
      Invoice.find({
        organizationId: user.organizationId,
        projectId,
        del_flag: false,
      })
        .populate("customerId", "name company")
        .sort({ invoiceDate: -1 })
        .lean(),

      Expense.find({
        organizationId: user.organizationId,
        projectId,
        del_flag: false,
      })
        .populate("vendorId", "companyName")
        .populate("categoryId", "name")
        .sort({ date: -1 })
        .lean(),
    ]);

    return {
      success: true,
      data: {
        invoices: JSON.parse(JSON.stringify(invoices)),
        expenses: JSON.parse(JSON.stringify(expenses)),
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getProjectTransactions = await withAuth(_getProjectTransactions);
