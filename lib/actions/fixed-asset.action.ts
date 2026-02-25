"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import FixedAsset from "@/lib/models/fixed-asset.model";
import { withAuth } from "@/lib/helpers/auth";
import { revalidatePath } from "next/cache";

async function _createFixedAsset(user: any, data: {
  assetName: string;
  description?: string;
  category: string;
  purchaseDate: Date;
  purchasePrice: number;
  salvageValue: number;
  usefulLife: number;
  depreciationMethod: string;
  assetAccountId: string;
  depreciationAccountId: string;
  accumulatedDepreciationAccountId: string;
  location?: string;
  serialNumber?: string;
  vendor?: string;
  warrantyExpiry?: Date;
  notes?: string;
}) {
  try {
    await connectToDB();

    const count = await FixedAsset.countDocuments({ organizationId: user.organizationId });
    const assetNumber = `FA-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    const asset = await FixedAsset.create({
      ...data,
      assetNumber,
      organizationId: user.organizationId,
      currentValue: data.purchasePrice,
      accumulatedDepreciation: 0,
      status: "active",
      del_flag: false,
      createdBy: user._id,
      mod_flag: 0,
    });

    revalidatePath("/dashboard/fixed-assets");
    return { success: true, asset: JSON.parse(JSON.stringify(asset)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const createFixedAsset = await withAuth(_createFixedAsset);

async function _getAllFixedAssets(user: any) {
  try {
    await connectToDB();

    const assets = await FixedAsset.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("assetAccountId", "accountCode accountName")
      .populate("depreciationAccountId", "accountCode accountName")
      .populate("accumulatedDepreciationAccountId", "accountCode accountName")
      .sort({ createdAt: -1 });

    return { success: true, assets: JSON.parse(JSON.stringify(assets)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const getAllFixedAssets = await withAuth(_getAllFixedAssets);

async function _getFixedAssetById(user: any, assetId: string) {
  try {
    await connectToDB();

    const asset = await FixedAsset.findOne({
      _id: assetId,
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("assetAccountId", "accountCode accountName")
      .populate("depreciationAccountId", "accountCode accountName")
      .populate("accumulatedDepreciationAccountId", "accountCode accountName");

    if (!asset) throw new Error("Asset not found");

    return { success: true, asset: JSON.parse(JSON.stringify(asset)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const getFixedAssetById = await withAuth(_getFixedAssetById);

async function _updateFixedAsset(user: any, assetId: string, data: any) {
  try {
    await connectToDB();

    const asset = await FixedAsset.findOneAndUpdate(
      { _id: assetId, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, mod_flag: 1 },
      { new: true }
    );

    if (!asset) throw new Error("Asset not found");

    revalidatePath("/dashboard/fixed-assets");
    return { success: true, asset: JSON.parse(JSON.stringify(asset)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const updateFixedAsset = await withAuth(_updateFixedAsset);

async function _deleteFixedAsset(user: any, assetId: string) {
  try {
    await connectToDB();

    await FixedAsset.findOneAndUpdate(
      { _id: assetId, organizationId: user.organizationId },
      { del_flag: true, modifiedBy: user._id, mod_flag: 1 }
    );

    revalidatePath("/dashboard/fixed-assets");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const deleteFixedAsset = await withAuth(_deleteFixedAsset);

export const getFixedAssets = getAllFixedAssets;
