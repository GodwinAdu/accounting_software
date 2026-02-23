"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import FixedAsset from "@/lib/models/fixed-asset.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { revalidatePath } from "next/cache";
import { withAuth, type User } from "@/lib/helpers/auth";

async function _createFixedAsset(user: User, data: any) {
  try {
    const hasPermission = await checkPermission("assets_create");
    if (!hasPermission) return { error: "You don't have permission to create assets" };

    await connectToDB();

    const asset = await FixedAsset.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id || user.id,
      currentValue: data.purchasePrice,
    });

    revalidatePath(`/${user.organizationId}/dashboard/${user.id}/assets/all`);
    return { success: true, data: JSON.parse(JSON.stringify(asset)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createFixedAsset = await withAuth(_createFixedAsset);

async function _getFixedAssets(user: User) {
  try {
    const hasPermission = await checkPermission("assets_view");
    if (!hasPermission) return { error: "You don't have permission to view assets" };

    await connectToDB();

    const assets = await FixedAsset.find({
      organizationId: user.organizationId,
      del_flag: false,
    }).sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(assets)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getFixedAssets = await withAuth(_getFixedAssets);

async function _getFixedAssetById(user: User, id: string) {
  try {
    const hasPermission = await checkPermission("assets_view");
    if (!hasPermission) return { error: "You don't have permission to view assets" };

    await connectToDB();

    const asset = await FixedAsset.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!asset) return { error: "Asset not found" };
    return { success: true, data: JSON.parse(JSON.stringify(asset)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getFixedAssetById = await withAuth(_getFixedAssetById);

async function _updateFixedAsset(user: User, id: string, data: any) {
  try {
    const hasPermission = await checkPermission("assets_edit");
    if (!hasPermission) return { error: "You don't have permission to edit assets" };

    await connectToDB();

    const asset = await FixedAsset.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id || user.id, $inc: { mod_flag: 1 } },
      { new: true }
    );

    if (!asset) return { error: "Asset not found" };

    revalidatePath(`/${user.organizationId}/dashboard/${user.id}/assets/all`);
    return { success: true, data: JSON.parse(JSON.stringify(asset)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const updateFixedAsset = await withAuth(_updateFixedAsset);

async function _deleteFixedAsset(user: User, id: string) {
  try {
    const hasPermission = await checkPermission("assets_delete");
    if (!hasPermission) return { error: "You don't have permission to delete assets" };

    await connectToDB();

    const asset = await FixedAsset.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId },
      { del_flag: true, deletedBy: user._id || user.id },
      { new: true }
    );

    if (!asset) return { error: "Asset not found" };

    revalidatePath(`/${user.organizationId}/dashboard/${user.id}/assets/all`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const deleteFixedAsset = await withAuth(_deleteFixedAsset);
