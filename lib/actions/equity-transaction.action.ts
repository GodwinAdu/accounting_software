"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import EquityTransaction from "@/lib/models/equity-transaction.model";
import { checkPermission } from "@/lib/helpers/check-permission";
import { revalidatePath } from "next/cache";
import { withAuth, type User } from "@/lib/helpers/auth";

async function _createEquityTransaction(user: User, data: any) {
  try {
    const hasPermission = await checkPermission("equity_create");
    if (!hasPermission) return { error: "You don't have permission to create equity transactions" };

    await connectToDB();

    const transaction = await EquityTransaction.create({
      ...data,
      organizationId: user.organizationId,
      createdBy: user._id || user.id,
    });

    revalidatePath(`/${user.organizationId}/dashboard/${user.id}/equity/all`);
    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createEquityTransaction = await withAuth(_createEquityTransaction);

async function _getEquityTransactions(user: User) {
  try {
    const hasPermission = await checkPermission("equity_view");
    if (!hasPermission) return { error: "You don't have permission to view equity transactions" };

    await connectToDB();

    const transactions = await EquityTransaction.find({
      organizationId: user.organizationId,
      del_flag: false,
    }).sort({ transactionDate: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(transactions)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getEquityTransactions = await withAuth(_getEquityTransactions);

async function _getEquityTransactionById(user: User, id: string) {
  try {
    const hasPermission = await checkPermission("equity_view");
    if (!hasPermission) return { error: "You don't have permission to view equity transactions" };

    await connectToDB();

    const transaction = await EquityTransaction.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!transaction) return { error: "Transaction not found" };
    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getEquityTransactionById = await withAuth(_getEquityTransactionById);

async function _updateEquityTransaction(user: User, id: string, data: any) {
  try {
    const hasPermission = await checkPermission("equity_edit");
    if (!hasPermission) return { error: "You don't have permission to edit equity transactions" };

    await connectToDB();

    const transaction = await EquityTransaction.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id || user.id, $inc: { mod_flag: 1 } },
      { new: true }
    );

    if (!transaction) return { error: "Transaction not found" };

    revalidatePath(`/${user.organizationId}/dashboard/${user.id}/equity/all`);
    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const updateEquityTransaction = await withAuth(_updateEquityTransaction);

async function _deleteEquityTransaction(user: User, id: string) {
  try {
    const hasPermission = await checkPermission("equity_delete");
    if (!hasPermission) return { error: "You don't have permission to delete equity transactions" };

    await connectToDB();

    const transaction = await EquityTransaction.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId },
      { del_flag: true, deletedBy: user._id || user.id },
      { new: true }
    );

    if (!transaction) return { error: "Transaction not found" };

    revalidatePath(`/${user.organizationId}/dashboard/${user.id}/equity/all`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const deleteEquityTransaction = await withAuth(_deleteEquityTransaction);
