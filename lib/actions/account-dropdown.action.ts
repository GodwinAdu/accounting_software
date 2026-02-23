"use server";

import { connectToDB } from "../connection/mongoose";
import Account from "../models/account.model";
import { withAuth } from "../helpers/auth";

// Get accounts by type for dropdowns
async function _getAccountsForDropdown(user: any, accountType?: string) {
  try {
    await connectToDB();

    const query: any = {
      organizationId: user.organizationId,
      del_flag: false,
      isActive: true,
      isParent: false // Only leaf accounts can be used in transactions
    };

    if (accountType) {
      query.accountType = accountType;
    }

    const accounts = await Account.find(query)
      .select("_id accountCode accountName accountType accountSubType")
      .sort({ accountCode: 1 })
      .lean();

    return { 
      success: true, 
      data: JSON.parse(JSON.stringify(accounts)) 
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getAccountsForDropdown = await withAuth(_getAccountsForDropdown);

// Get revenue accounts for invoices
async function _getRevenueAccounts(user: any) {
  return _getAccountsForDropdown(user, "revenue");
}

export const getRevenueAccounts = await withAuth(_getRevenueAccounts);

// Get expense accounts for bills
async function _getExpenseAccounts(user: any) {
  return _getAccountsForDropdown(user, "expense");
}

export const getExpenseAccounts = await withAuth(_getExpenseAccounts);

// Get asset accounts (for bank/cash)
async function _getAssetAccounts(user: any) {
  return _getAccountsForDropdown(user, "asset");
}

export const getAssetAccounts = await withAuth(_getAssetAccounts);

// Get liability accounts (for payables)
async function _getLiabilityAccounts(user: any) {
  return _getAccountsForDropdown(user, "liability");
}

export const getLiabilityAccounts = await withAuth(_getLiabilityAccounts);

// Get default account by name pattern
async function _getDefaultAccountByName(user: any, accountType: string, namePattern: string) {
  try {
    await connectToDB();

    const account = await Account.findOne({
      organizationId: user.organizationId,
      accountType,
      accountName: { $regex: namePattern, $options: "i" },
      del_flag: false,
      isActive: true
    })
    .select("_id accountCode accountName")
    .lean();

    return { 
      success: true, 
      data: account ? JSON.parse(JSON.stringify(account)) : null 
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getDefaultAccountByName = await withAuth(_getDefaultAccountByName);
