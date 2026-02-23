"use server";

import { connectToDB } from "../connection/mongoose";
import Asset from "../models/asset.model";
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

export async function postDepreciationToGL(assetId: string, depreciationAmount: number, userId: string) {
  try {
    await connectToDB();

    const asset = await Asset.findById(assetId);
    if (!asset) throw new Error("Asset not found");

    const depreciationExpenseAccount = asset.depreciationAccountId || await getDefaultAccount(String(asset.organizationId), "Depreciation Expense");
    const accumulatedDepAccount = asset.accumulatedDepAccountId || await getDefaultAccount(String(asset.organizationId), "Accumulated Depreciation");

    if (!depreciationExpenseAccount || !accumulatedDepAccount) {
      throw new Error("Required accounts not found");
    }

    const lineItems = [
      {
        accountId: depreciationExpenseAccount,
        description: `Depreciation - ${asset.name}`,
        debit: depreciationAmount,
        credit: 0,
      },
      {
        accountId: accumulatedDepAccount,
        description: `Accumulated depreciation - ${asset.name}`,
        debit: 0,
        credit: depreciationAmount,
      },
    ];

    await JournalEntry.create({
      organizationId: asset.organizationId,
      entryNumber: `JE-DEP-${Date.now().toString().slice(-8)}`,
      entryDate: new Date(),
      referenceType: "asset_depreciation",
      referenceId: assetId,
      description: `Monthly depreciation for ${asset.name}`,
      lineItems,
      totalDebit: depreciationAmount,
      totalCredit: depreciationAmount,
      status: "posted",
      createdBy: userId,
      del_flag: false,
      mod_flag: 0,
    });

    await Asset.findByIdAndUpdate(assetId, {
      $inc: { accumulatedDepreciation: depreciationAmount },
      currentValue: asset.purchasePrice - (asset.accumulatedDepreciation + depreciationAmount),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Post depreciation to GL error:", error);
    return { error: error.message };
  }
}
