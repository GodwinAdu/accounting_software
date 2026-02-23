"use server";

import { connectToDB } from "../connection/mongoose";
import StockAdjustment from "../models/stock-adjustment.model";
import JournalEntry from "../models/journal-entry.model";
import Account from "../models/account.model";

async function getDefaultAccount(organizationId: string, accountName: string) {
  await connectToDB();
  const account = await Account.findOne({
    organizationId,
    name: { $regex: new RegExp(accountName, "i") },
    del_flag: false,
  });
  return account?._id;
}

export async function postStockAdjustmentToGL(adjustmentId: string, userId: string) {
  try {
    await connectToDB();

    const adjustment = await StockAdjustment.findById(adjustmentId).populate("productId");
    if (!adjustment) throw new Error("Stock adjustment not found");

    const inventoryAccount = adjustment.inventoryAccountId || await getDefaultAccount(String(adjustment.organizationId), "Inventory");
    const adjustmentAccount = adjustment.adjustmentAccountId || await getDefaultAccount(String(adjustment.organizationId), "Inventory Adjustment");

    if (!inventoryAccount || !adjustmentAccount) {
      throw new Error("Required accounts not found");
    }

    const isIncrease = adjustment.adjustmentType === "increase";
    const lineItems = [
      {
        accountId: inventoryAccount,
        description: `Stock adjustment - ${adjustment.adjustmentNumber}`,
        debit: isIncrease ? adjustment.totalValue : 0,
        credit: isIncrease ? 0 : adjustment.totalValue,
      },
      {
        accountId: adjustmentAccount,
        description: `${adjustment.reason} - ${adjustment.adjustmentNumber}`,
        debit: isIncrease ? 0 : adjustment.totalValue,
        credit: isIncrease ? adjustment.totalValue : 0,
      },
    ];

    await JournalEntry.create({
      organizationId: adjustment.organizationId,
      entryNumber: `JE-ADJ-${Date.now().toString().slice(-8)}`,
      entryDate: adjustment.adjustmentDate,
      referenceType: "stock_adjustment",
      referenceId: adjustmentId,
      description: `Stock adjustment ${adjustment.adjustmentNumber}`,
      lineItems,
      totalDebit: adjustment.totalValue,
      totalCredit: adjustment.totalValue,
      status: "posted",
      createdBy: userId,
      del_flag: false,
      mod_flag: 0,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Post stock adjustment to GL error:", error);
    return { error: error.message };
  }
}
