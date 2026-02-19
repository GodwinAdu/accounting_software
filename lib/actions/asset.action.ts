"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import Asset from "@/lib/models/asset.model";
import AssetCategory from "@/lib/models/asset-category.model";
import { withAuth } from "@/lib/helpers/auth";
import { checkPermission } from "@/lib/helpers/check-permission";

async function _getAssetRegister(user: any) {
  const hasPermission = await checkPermission("assetRegister_view");
  if (!hasPermission) throw new Error("Permission denied");

  await connectToDB();

  const assets = await Asset.find({
    organizationId: user.organizationId,
    del_flag: false
  }).populate("categoryId", "name").sort({ createdAt: -1 }).lean();

  const totalValue = assets.reduce((sum: number, a: any) => sum + a.currentValue, 0);
  const totalDepreciation = assets.reduce((sum: number, a: any) => sum + a.accumulatedDepreciation, 0);
  const activeAssets = assets.filter((a: any) => a.status === "active").length;
  const netValue = totalValue - totalDepreciation;

  return JSON.parse(JSON.stringify({
    assets,
    summary: { totalAssets: assets.length, totalValue, totalDepreciation, netValue, activeAssets }
  }));
}

export const getAssetRegister = await withAuth(_getAssetRegister);

async function _getDepreciationData(user: any) {
  const hasPermission = await checkPermission("depreciation_view");
  if (!hasPermission) throw new Error("Permission denied");

  await connectToDB();

  const assets = await Asset.find({
    organizationId: user.organizationId,
    del_flag: false,
    status: "active"
  }).populate("categoryId", "name").sort({ createdAt: -1 }).lean();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyDepreciation = assets.reduce((sum: number, a: any) => {
    const annualDep = (a.purchasePrice - a.salvageValue) / a.usefulLife;
    return sum + (annualDep / 12);
  }, 0);

  const yearlyDepreciation = assets.reduce((sum: number, a: any) => {
    return sum + ((a.purchasePrice - a.salvageValue) / a.usefulLife);
  }, 0);

  const totalAccumulated = assets.reduce((sum: number, a: any) => sum + a.accumulatedDepreciation, 0);

  return JSON.parse(JSON.stringify({
    assets,
    summary: { monthlyDepreciation, yearlyDepreciation, totalAccumulated, assetsCount: assets.length }
  }));
}

export const getDepreciationData = await withAuth(_getDepreciationData);

async function _getAssetCategories(user: any) {
  const hasPermission = await checkPermission("assetCategories_view");
  if (!hasPermission) throw new Error("Permission denied");

  await connectToDB();

  const [categories, assets] = await Promise.all([
    AssetCategory.find({
      organizationId: user.organizationId,
      del_flag: false
    }).sort({ createdAt: -1 }).lean(),
    Asset.find({
      organizationId: user.organizationId,
      del_flag: false
    }).lean()
  ]);

  const categoriesWithAssets = categories.map((cat: any) => {
    const categoryAssets = assets.filter((a: any) => String(a.categoryId) === String(cat._id));
    const totalValue = categoryAssets.reduce((sum: number, a: any) => sum + a.currentValue, 0);
    return { ...cat, assetCount: categoryAssets.length, totalValue };
  });

  const totalCategories = categories.length;
  const totalAssets = assets.length;
  const totalValue = assets.reduce((sum: number, a: any) => sum + a.currentValue, 0);

  return JSON.parse(JSON.stringify({
    categories: categoriesWithAssets,
    summary: { totalCategories, totalAssets, totalValue }
  }));
}

export const getAssetCategories = await withAuth(_getAssetCategories);
