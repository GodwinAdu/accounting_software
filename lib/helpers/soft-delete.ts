import { Model, Document } from "mongoose";

export interface SoftDeleteFields {
  del_flag: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  deletionReason?: string;
  deletionMetadata?: {
    ipAddress?: string;
    userAgent?: string;
    snapshot?: any;
  };
}

/**
 * Soft delete a document with metadata
 */
export async function softDelete<T extends Document & SoftDeleteFields>(
  model: Model<T>,
  id: string,
  userId: string,
  metadata?: {
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
    snapshot?: any;
  }
): Promise<T | null> {
  return await model.findByIdAndUpdate(
    id,
    {
      del_flag: true,
      deletedAt: new Date(),
      deletedBy: userId,
      deletionReason: metadata?.reason,
      deletionMetadata: {
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        snapshot: metadata?.snapshot,
      },
    },
    { new: true }
  );
}

/**
 * Restore a soft-deleted document
 */
export async function restoreDeleted<T extends Document & SoftDeleteFields>(
  model: Model<T>,
  id: string
): Promise<T | null> {
  return await model.findByIdAndUpdate(
    id,
    {
      del_flag: false,
      deletedAt: null,
      deletedBy: null,
    },
    { new: true }
  );
}

/**
 * Get all deleted documents (admin only)
 */
export async function getDeletedItems<T extends Document & SoftDeleteFields>(
  model: Model<T>,
  organizationId: string,
  options?: {
    limit?: number;
    skip?: number;
    sortBy?: string;
  }
): Promise<{ items: T[]; total: number }> {
  const query = { del_flag: true, organizationId };
  
  const items = await model
    .find(query)
    .sort(options?.sortBy || "-deletedAt")
    .limit(options?.limit || 50)
    .skip(options?.skip || 0)
    .lean();

  const total = await model.countDocuments(query);

  return { items: items as T[], total };
}

/**
 * Permanently delete a document (admin only, use with caution)
 */
export async function permanentDelete<T extends Document>(
  model: Model<T>,
  id: string
): Promise<boolean> {
  const result = await model.findByIdAndDelete(id);
  return !!result;
}
