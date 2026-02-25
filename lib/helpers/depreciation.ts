"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import FixedAsset from "@/lib/models/fixed-asset.model";
import JournalEntry from "@/lib/models/journal-entry.model";

export async function calculateDepreciation(asset: any) {
  const monthsOwned = Math.floor(
    (new Date().getTime() - new Date(asset.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  
  const yearsOwned = monthsOwned / 12;
  
  if (asset.depreciationMethod === "straight_line") {
    const annualDepreciation = (asset.purchasePrice - asset.salvageValue) / asset.usefulLife;
    const totalDepreciation = Math.min(
      annualDepreciation * yearsOwned,
      asset.purchasePrice - asset.salvageValue
    );
    return {
      annualDepreciation,
      monthlyDepreciation: annualDepreciation / 12,
      totalDepreciation,
      currentValue: asset.purchasePrice - totalDepreciation,
      remainingLife: Math.max(0, asset.usefulLife - yearsOwned),
    };
  }
  
  if (asset.depreciationMethod === "declining_balance") {
    const rate = 2 / asset.usefulLife;
    let bookValue = asset.purchasePrice;
    let totalDepreciation = 0;
    
    for (let year = 0; year < Math.floor(yearsOwned); year++) {
      const yearDepreciation = bookValue * rate;
      totalDepreciation += yearDepreciation;
      bookValue -= yearDepreciation;
    }
    
    const currentValue = Math.max(bookValue, asset.salvageValue);
    
    return {
      annualDepreciation: bookValue * rate,
      monthlyDepreciation: (bookValue * rate) / 12,
      totalDepreciation,
      currentValue,
      remainingLife: Math.max(0, asset.usefulLife - yearsOwned),
    };
  }
  
  return {
    annualDepreciation: 0,
    monthlyDepreciation: 0,
    totalDepreciation: 0,
    currentValue: asset.purchasePrice,
    remainingLife: asset.usefulLife,
  };
}

export async function runMonthlyDepreciation(organizationId: string, userId: string) {
  await connectToDB();

  const assets = await FixedAsset.find({
    organizationId,
    status: "active",
    del_flag: false,
  });

  const results = [];

  for (const asset of assets) {
    const depreciation = await calculateDepreciation(asset);
    
    if (depreciation.monthlyDepreciation > 0) {
      const journalEntry = await JournalEntry.create({
        organizationId,
        entryNumber: `DEP-${new Date().toISOString().slice(0, 7)}-${asset.assetNumber}`,
        date: new Date(),
        description: `Monthly depreciation for ${asset.assetName}`,
        type: "depreciation",
        status: "posted",
        lineItems: [
          {
            accountId: asset.depreciationAccountId,
            description: `Depreciation expense - ${asset.assetName}`,
            debit: depreciation.monthlyDepreciation,
            credit: 0,
          },
          {
            accountId: asset.accumulatedDepreciationAccountId,
            description: `Accumulated depreciation - ${asset.assetName}`,
            debit: 0,
            credit: depreciation.monthlyDepreciation,
          },
        ],
        totalDebit: depreciation.monthlyDepreciation,
        totalCredit: depreciation.monthlyDepreciation,
        del_flag: false,
        createdBy: userId,
        mod_flag: 0,
      });

      await FixedAsset.findByIdAndUpdate(asset._id, {
        accumulatedDepreciation: depreciation.totalDepreciation,
        currentValue: depreciation.currentValue,
        status: depreciation.currentValue <= asset.salvageValue ? "fully_depreciated" : "active",
      });

      results.push({
        assetNumber: asset.assetNumber,
        assetName: asset.assetName,
        depreciation: depreciation.monthlyDepreciation,
        journalEntry: journalEntry.entryNumber,
      });
    }
  }

  return { success: true, results };
}
