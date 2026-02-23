"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import Account from "../models/account.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createAccount(user: any, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    // Remove parentAccountId if it's empty or undefined
    const accountData = { ...data };
    if (!accountData.parentAccountId) {
      delete accountData.parentAccountId;
    }

    const account = await Account.create({
      ...accountData,
      organizationId: user.organizationId,
      createdBy: user._id,
    });

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "account",
      resourceId: String(account._id),
      details: { after: account },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(account)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getAccounts(user: any) {
  try {
    await connectToDB();

    const accounts = await Account.find({
      organizationId: user.organizationId,
      del_flag: false,
    })
      .populate("parentAccountId", "accountName accountCode")
      .sort({ accountCode: 1 });

    return { success: true, data: JSON.parse(JSON.stringify(accounts)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getAccountsByType(user: any, accountType: string) {
  try {
    await connectToDB();

    const accounts = await Account.find({
      organizationId: user.organizationId,
      accountType,
      del_flag: false,
      isActive: true,
    }).sort({ accountCode: 1 });

    return { success: true, data: JSON.parse(JSON.stringify(accounts)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getAccountById(user: any, id: string) {
  try {
    await connectToDB();

    const account = await Account.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    }).populate("parentAccountId", "accountName accountCode");

    if (!account) {
      return { error: "Account not found" };
    }

    return { success: true, data: JSON.parse(JSON.stringify(account)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _updateAccount(user: any, id: string, data: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const oldAccount = await Account.findOne({
      _id: id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!oldAccount) {
      return { error: "Account not found" };
    }

    const account = await Account.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false },
      { ...data, modifiedBy: user._id, $inc: { mod_flag: 1 } },
      { new: true }
    );

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "account",
      resourceId: String(id),
      details: { before: oldAccount, after: account },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(account)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _deleteAccount(user: any, id: string, pathname: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    // Check if account has transactions
    const GeneralLedger = (await import("../models/general-ledger.model")).default;
    const hasTransactions = await GeneralLedger.findOne({ accountId: id, del_flag: false });

    if (hasTransactions) {
      return { error: "Cannot delete account with existing transactions" };
    }

    const account = await Account.findOneAndUpdate(
      { _id: id, organizationId: user.organizationId, del_flag: false, isSystemAccount: false },
      { del_flag: true, deletedBy: user._id, isActive: false },
      { new: true }
    );

    if (!account) {
      return { error: "Account not found or is a system account" };
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "delete",
      resource: "account",
      resourceId: String(id),
      details: { before: account },
    });

    revalidatePath(pathname);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getAccountBalance(user: any, accountId: string) {
  try {
    await connectToDB();

    const account = await Account.findOne({
      _id: accountId,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!account) {
      return { error: "Account not found" };
    }

    return {
      success: true,
      data: {
        currentBalance: account.currentBalance,
        debitBalance: account.debitBalance,
        creditBalance: account.creditBalance,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getChartOfAccountsSummary(user: any) {
  try {
    await connectToDB();

    const accounts = await Account.find({
      organizationId: user.organizationId,
      del_flag: false,
    });

    const summary = {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter((a) => a.isActive).length,
      assets: accounts.filter((a) => a.accountType === "asset").reduce((sum, a) => sum + a.currentBalance, 0),
      liabilities: accounts.filter((a) => a.accountType === "liability").reduce((sum, a) => sum + a.currentBalance, 0),
      equity: accounts.filter((a) => a.accountType === "equity").reduce((sum, a) => sum + a.currentBalance, 0),
      revenue: accounts.filter((a) => a.accountType === "revenue").reduce((sum, a) => sum + a.currentBalance, 0),
      expenses: accounts.filter((a) => a.accountType === "expense").reduce((sum, a) => sum + a.currentBalance, 0),
    };

    return { success: true, data: summary };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _initializeDefaultAccounts(user: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const existingAccounts = await Account.countDocuments({
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (existingAccounts > 0) {
      return { error: "Accounts already exist for this organization" };
    }

    const { STANDARD_CHART_OF_ACCOUNTS } = await import("../constants/chart-of-accounts");
    const accountMap = new Map();

    for (const template of STANDARD_CHART_OF_ACCOUNTS) {
      const parentId = template.parent ? accountMap.get(template.parent) : undefined;

      const account = await Account.create({
        organizationId: user.organizationId,
        accountCode: template.code,
        accountName: template.name,
        accountType: template.type,
        accountSubType: template.subType,
        parentAccountId: parentId,
        level: template.level,
        isParent: template.isParent || false,
        currency: "GHS",
        currentBalance: 0,
        debitBalance: 0,
        creditBalance: 0,
        isActive: true,
        isSystemAccount: true,
        allowManualJournal: true,
        reconciliationEnabled: false,
        del_flag: false,
        createdBy: user._id,
        mod_flag: 0,
      });

      accountMap.set(template.code, account._id);
    }

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "account",
      resourceId: "bulk_initialization",
      details: { after: { count: STANDARD_CHART_OF_ACCOUNTS.length } },
    });

    revalidatePath("/");
    return { success: true, message: "Chart of accounts initialized with 35+ standard accounts" };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getTransactableAccounts(user: any, accountType?: string) {
  try {
    await connectToDB();

    const query: any = {
      organizationId: user.organizationId,
      del_flag: false,
      isActive: true,
      $or: [
        { isParent: false },
        { isParent: true, allowManualJournal: true }
      ]
    };

    if (accountType) {
      query.accountType = accountType;
    }

    const accounts = await Account.find(query)
      .populate("parentAccountId", "accountName accountCode")
      .sort({ accountCode: 1 });

    return { success: true, data: JSON.parse(JSON.stringify(accounts)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createAccount = await withAuth(_createAccount);
export const getAccounts = await withAuth(_getAccounts);
export const getTransactableAccounts = await withAuth(_getTransactableAccounts);
export const getAccountsByType = await withAuth(_getAccountsByType);
export const getAccountById = await withAuth(_getAccountById);
export const updateAccount = await withAuth(_updateAccount);
export const deleteAccount = await withAuth(_deleteAccount);
export const getAccountBalance = await withAuth(_getAccountBalance);
export const getChartOfAccountsSummary = await withAuth(_getChartOfAccountsSummary);
export const initializeDefaultAccounts = await withAuth(_initializeDefaultAccounts);
