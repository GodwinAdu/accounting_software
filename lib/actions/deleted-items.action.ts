"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import { currentUser } from "@/lib/helpers/session";
import { checkAdmin } from "@/lib/helpers/check-permission";
import { getDeletedItems, restoreDeleted, permanentDelete } from "@/lib/helpers/soft-delete";
import BankAccount from "@/lib/models/bank-account.model";
import BankTransaction from "@/lib/models/bank-transaction.model";
import Vendor from "@/lib/models/vendor.model";
import Customer from "@/lib/models/customer.model";
import Invoice from "@/lib/models/invoice.model";
import Product from "@/lib/models/product.model";
import Account from "@/lib/models/account.model";
import JournalEntry from "@/lib/models/journal-entry.model";
import { logAudit } from "@/lib/helpers/audit";

const MODEL_MAP = {
  bankAccounts: BankAccount,
  transactions: BankTransaction,
  vendors: Vendor,
  customers: Customer,
  invoices: Invoice,
  products: Product,
  chartOfAccounts: Account,
  journalEntries: JournalEntry,
};

type ModelType = keyof typeof MODEL_MAP;

/**
 * Get all deleted items for a specific model (Admin only)
 */
export async function getDeletedItemsByType(
  modelType: ModelType,
  page: number = 1,
  limit: number = 50
) {
  try {
    await connectToDB();
    const user = await currentUser();
    if (!user) return { error: "Unauthorized" };

    const isAdmin = await checkAdmin();
    if (!isAdmin) return { error: "Admin access required" };

    const model = MODEL_MAP[modelType];
    if (!model) return { error: "Invalid model type" };

    const { items, total } = await getDeletedItems(
      model,
      String(user.organizationId),
      { limit, skip: (page - 1) * limit }
    );

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch deleted items" };
  }
}

/**
 * Restore a deleted item (Admin only)
 */
export async function restoreDeletedItem(modelType: ModelType, itemId: string) {
  try {
    await connectToDB();
    const user = await currentUser();
    if (!user) return { error: "Unauthorized" };

    const isAdmin = await checkAdmin();
    if (!isAdmin) return { error: "Admin access required" };

    const model = MODEL_MAP[modelType];
    if (!model) return { error: "Invalid model type" };

    const restored = await restoreDeleted(model, itemId);
    if (!restored) return { error: "Item not found" };

    await logAudit({
      userId: String(user._id),
      organizationId: String(user.organizationId),
      action: "restore",
      resource: modelType,
      resourceId: itemId,
      details: { metadata: { restoredBy: user.email } },
    });

    return { success: true, item: restored };
  } catch (error: any) {
    return { error: error.message || "Failed to restore item" };
  }
}

/**
 * Permanently delete an item (Admin only, use with extreme caution)
 */
export async function permanentlyDeleteItem(modelType: ModelType, itemId: string) {
  try {
    await connectToDB();
    const user = await currentUser();
    if (!user) return { error: "Unauthorized" };

    const isAdmin = await checkAdmin();
    if (!isAdmin) return { error: "Admin access required" };

    const model = MODEL_MAP[modelType];
    if (!model) return { error: "Invalid model type" };

    const deleted = await permanentDelete(model, itemId);
    if (!deleted) return { error: "Item not found" };

    await logAudit({
      userId: String(user._id),
      organizationId: String(user.organizationId),
      action: "permanent_delete",
      resource: modelType,
      resourceId: itemId,
      details: { metadata: { warning: "PERMANENT_DELETE", deletedBy: user.email } },
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to permanently delete item" };
  }
}

/**
 * Get deleted items summary (Admin only)
 */
export async function getDeletedItemsSummary() {
  try {
    await connectToDB();
    const user = await currentUser();
    if (!user) return { error: "Unauthorized" };

    const isAdmin = await checkAdmin();
    if (!isAdmin) return { error: "Admin access required" };

    const summary = await Promise.all(
      Object.entries(MODEL_MAP).map(async ([key, model]) => {
        const count = await model.countDocuments({
          del_flag: true,
          organizationId: String(user.organizationId),
        } as any);
        return { type: key, count };
      })
    );

    return { summary };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch summary" };
  }
}
