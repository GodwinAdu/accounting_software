"use server";

import { connectToDB } from "../connection/mongoose";
import { withAuth } from "../helpers/auth";

async function _getVATReturnData(user: any, startDate?: Date, endDate?: Date) {
  try {
    await connectToDB();

    const Invoice = (await import("../models/invoice.model")).default;
    const Expense = (await import("../models/expense.model")).default;

    const dateFilter = startDate && endDate ? {
      createdAt: { $gte: startDate, $lte: endDate }
    } : {};

    const invoices = await Invoice.find({
      organizationId: user.organizationId,
      del_flag: false,
      status: { $in: ["sent", "paid"] },
      ...dateFilter,
    }).lean();

    const expenses = await Expense.find({
      organizationId: user.organizationId,
      del_flag: false,
      isTaxable: true,
      ...dateFilter,
    }).lean();

    const outputVAT = invoices.reduce((sum, inv) => sum + (inv.taxAmount || 0), 0);
    const inputVAT = expenses.reduce((sum, exp) => sum + (exp.taxAmount || 0), 0);
    const netVAT = outputVAT - inputVAT;

    const salesByRate: { [key: number]: { amount: number; vat: number } } = {};
    invoices.forEach(inv => {
      if (inv.lineItems && inv.lineItems.length > 0) {
        inv.lineItems.forEach((item: any) => {
          const rate = item.taxRate || 0;
          if (!salesByRate[rate]) {
            salesByRate[rate] = { amount: 0, vat: 0 };
          }
          salesByRate[rate].amount += item.amount || 0;
          salesByRate[rate].vat += item.taxAmount || 0;
        });
      }
    });

    const purchasesByRate: { [key: number]: { amount: number; vat: number } } = {};
    expenses.forEach(exp => {
      const rate = exp.taxRate || 0;
      if (!purchasesByRate[rate]) {
        purchasesByRate[rate] = { amount: 0, vat: 0 };
      }
      purchasesByRate[rate].amount += exp.amount || 0;
      purchasesByRate[rate].vat += exp.taxAmount || 0;
    });

    return {
      success: true,
      data: {
        outputVAT,
        inputVAT,
        netVAT,
        salesByRate: Object.entries(salesByRate).map(([rate, data]) => ({
          rate: parseFloat(rate),
          amount: data.amount,
          vat: data.vat,
        })),
        purchasesByRate: Object.entries(purchasesByRate).map(([rate, data]) => ({
          rate: parseFloat(rate),
          amount: data.amount,
          vat: data.vat,
        })),
        invoices: invoices.length,
        expenses: expenses.length,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getVATReturnData = await withAuth(_getVATReturnData);
