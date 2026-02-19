"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../connection/mongoose";
import Account from "../models/account.model";
import { withAuth } from "../helpers/auth";
import { logAudit } from "../helpers/audit";
import { checkWriteAccess } from "../helpers/check-write-access";

async function _createAccount(data: any, user: any) {
  try {
    await checkWriteAccess(String(user.organizationId));
    await connectToDB();

    const account = await Account.create({
      ...data,
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

    const defaultAccounts = [
      // Assets
      { accountCode: "1000", accountName: "Cash and Cash Equivalents", accountType: "asset", accountSubType: "current-asset", level: 0, isParent: true },
      { accountCode: "1010", accountName: "Petty Cash", accountType: "asset", accountSubType: "current-asset", level: 1, allowManualJournal: true },
      { accountCode: "1020", accountName: "Bank Account", accountType: "asset", accountSubType: "current-asset", level: 1, reconciliationEnabled: true },
      { accountCode: "1100", accountName: "Accounts Receivable", accountType: "asset", accountSubType: "current-asset", level: 0, isSystemAccount: true },
      { accountCode: "1200", accountName: "Inventory", accountType: "asset", accountSubType: "current-asset", level: 0 },
      { accountCode: "1500", accountName: "Fixed Assets", accountType: "asset", accountSubType: "fixed-asset", level: 0, isParent: true },
      
      // Liabilities
      { accountCode: "2000", accountName: "Accounts Payable", accountType: "liability", accountSubType: "current-liability", level: 0, isSystemAccount: true },
      { accountCode: "2100", accountName: "VAT Payable", accountType: "liability", accountSubType: "current-liability", level: 0, metadata: { taxRate: 12.5 } },
      { accountCode: "2200", accountName: "PAYE Payable", accountType: "liability", accountSubType: "current-liability", level: 0 },
      { accountCode: "2300", accountName: "SSNIT Payable", accountType: "liability", accountSubType: "current-liability", level: 0 },
      
      // Equity
      { accountCode: "3000", accountName: "Owner's Equity", accountType: "equity", accountSubType: "equity", level: 0 },
      { accountCode: "3100", accountName: "Retained Earnings", accountType: "equity", accountSubType: "retained-earnings", level: 0, isSystemAccount: true },
      
      // Revenue
      { accountCode: "4000", accountName: "Sales Revenue", accountType: "revenue", accountSubType: "operating-revenue", level: 0 },
      { accountCode: "4100", accountName: "Service Revenue", accountType: "revenue", accountSubType: "operating-revenue", level: 0 },
      
      // Expenses
      { accountCode: "5000", accountName: "Cost of Goods Sold", accountType: "expense", accountSubType: "cost-of-sales", level: 0 },
      { accountCode: "6000", accountName: "Operating Expenses", accountType: "expense", accountSubType: "operating-expense", level: 0, isParent: true },
      { accountCode: "6100", accountName: "Salaries and Wages", accountType: "expense", accountSubType: "operating-expense", level: 1 },
      { accountCode: "6200", accountName: "Rent Expense", accountType: "expense", accountSubType: "operating-expense", level: 1 },
      { accountCode: "6300", accountName: "Utilities Expense", accountType: "expense", accountSubType: "operating-expense", level: 1 },
    ];

    const accounts = await Account.insertMany(
      defaultAccounts.map((acc) => ({
        ...acc,
        organizationId: user.organizationId,
        currency: "GHS",
        isActive: true,
        createdBy: user._id,
      }))
    );

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "create",
      resource: "account",
      resourceId: "bulk_initialization",
      details: { after: { count: accounts.length, accountCodes: accounts.map(a => a.accountCode) } },
    });

    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(accounts)) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const createAccount = await withAuth(_createAccount);
export const getAccounts = await withAuth(_getAccounts);
export const getAccountsByType = await withAuth(_getAccountsByType);
export const getAccountById = await withAuth(_getAccountById);
export const updateAccount = await withAuth(_updateAccount);
export const deleteAccount = await withAuth(_deleteAccount);
export const getAccountBalance = await withAuth(_getAccountBalance);
export const getChartOfAccountsSummary = await withAuth(_getChartOfAccountsSummary);
export const initializeDefaultAccounts = await withAuth(_initializeDefaultAccounts);
