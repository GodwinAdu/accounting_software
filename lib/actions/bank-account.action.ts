"use server";

import { connectToDB } from "../connection/mongoose";
import BankAccount from "../models/bank-account.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";
import { checkPermission } from "../helpers/check-permission";

async function _createBankAccount(
  user: any,
  data: {
    accountNumber: string;
    accountName: string;
    bankName: string;
    bankBranch?: string;
    accountType: "checking" | "savings" | "credit-card" | "money-market" | "other";
    currency?: string;
    openingBalance: number;
    openingBalanceDate: Date;
    accountId?: string;
    routingNumber?: string;
    swiftCode?: string;
    iban?: string;
    isPrimary?: boolean;
    notes?: string;
  }
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    if (!await checkPermission("bankAccounts_create")) {
      return { success: false, error: "Permission denied" };
    }
    
    await connectToDB();

    const account = await BankAccount.create({
      organizationId: user.organizationId,
      ...data,
      currentBalance: data.openingBalance,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "bank_account",
      resourceId: String(account._id),
      details: { after: account },
    });

    return { success: true, data: JSON.parse(JSON.stringify(account)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getBankAccounts(user: any) {
  try {
    await connectToDB();

    const accounts = await BankAccount.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("accountId", "accountName accountCode")
      .sort({ isPrimary: -1, createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(accounts)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getBankAccountById(user: any, id: string) {
  try {
    await connectToDB();

    const account = await BankAccount.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    }).populate("accountId", "accountName accountCode");

    if (!account) return { error: "Bank account not found" };

    return { success: true, data: JSON.parse(JSON.stringify(account)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateBankAccount(
  user: any,
  id: string,
  data: {
    accountNumber?: string;
    accountName?: string;
    bankName?: string;
    bankBranch?: string;
    accountType?: "checking" | "savings" | "credit-card" | "money-market" | "other";
    currency?: string;
    accountId?: string;
    routingNumber?: string;
    swiftCode?: string;
    iban?: string;
    isActive?: boolean;
    isPrimary?: boolean;
    notes?: string;
  }
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    if (!await checkPermission("bankAccounts_update")) {
      return { success: false, error: "Permission denied" };
    }
    
    await connectToDB();

    const oldAccount = await BankAccount.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false
    });

    if (!oldAccount) return { error: "Bank account not found" };

    const account = await BankAccount.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, $inc: { mod_flag: 1 } },
      { new: true }
    );

    if (!account) return { error: "Bank account not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "bank_account",
      resourceId: String(id),
      details: { before: oldAccount, after: account },
    });

    return { success: true, data: JSON.parse(JSON.stringify(account)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteBankAccount(user: any, id: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    
    if (!await checkPermission("bankAccounts_delete")) {
      return { success: false, error: "Permission denied" };
    }
    
    await connectToDB();

    const account = await BankAccount.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { del_flag: true, deletedBy: user._id, isActive: false },
      { new: true }
    );

    if (!account) return { error: "Bank account not found" };

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "bank_account",
      resourceId: String(id),
      details: { before: account },
    });

    return { success: true, message: "Bank account deleted successfully" };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getBankAccountsSummary(user: any) {
  try {
    await connectToDB();

    const accounts = await BankAccount.find({
      organizationId: user.organizationId,
      del_flag: false,
      isActive: true,
    });

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
    const totalAccounts = accounts.length;
    const activeAccounts = accounts.filter((acc) => acc.isActive).length;

    return {
      success: true,
      data: {
        totalBalance,
        totalAccounts,
        activeAccounts,
        accounts: JSON.parse(JSON.stringify(accounts)),
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createBankAccount = await withAuth(_createBankAccount);
export const getBankAccounts = await withAuth(_getBankAccounts);
export const getBankAccountById = await withAuth(_getBankAccountById);
export const updateBankAccount = await withAuth(_updateBankAccount);
export const deleteBankAccount = await withAuth(_deleteBankAccount);
export const getBankAccountsSummary = await withAuth(_getBankAccountsSummary);
