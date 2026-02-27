"use server";

import { connectToDB } from "../connection/mongoose";
import GeneralLedger from "../models/general-ledger.model";
import Account from "../models/account.model";
import { withAuth } from "../helpers/auth";

async function _getGeneralLedger(user: any, filters: any) {
  try {
    await connectToDB();

    const query: any = {
      organizationId: user.organizationId,
      del_flag: false,
    };

    if (filters.accountId) query.accountId = filters.accountId;
    if (filters.startDate) query.transactionDate = { $gte: new Date(filters.startDate) };
    if (filters.endDate) {
      query.transactionDate = { ...query.transactionDate, $lte: new Date(filters.endDate) };
    }
    if (filters.fiscalYear) query.fiscalYear = filters.fiscalYear;
    if (filters.fiscalPeriod) query.fiscalPeriod = filters.fiscalPeriod;

    console.log('GL Query:', JSON.stringify(query));
    console.log('User orgId:', user.organizationId);

    const entries = await GeneralLedger.find(query)
      .populate("accountId", "accountName accountCode accountType")
      .populate("journalEntryId", "entryNumber description")
      .populate("createdBy", "firstName lastName email")
      .sort({ transactionDate: -1, createdAt: -1 })
      .lean();

    console.log('GL Entries found:', entries.length);

    return { success: true, data: entries };
  } catch (error: any) {
    console.error('GL Error:', error);
    return { error: error.message };
  }
}

async function _getAccountLedger(user: any, accountId: string, startDate?: string, endDate?: string) {
  try {
    await connectToDB();

    const query: any = {
      organizationId: user.organizationId,
      accountId,
      del_flag: false,
    };

    if (startDate) query.transactionDate = { $gte: new Date(startDate) };
    if (endDate) {
      query.transactionDate = { ...query.transactionDate, $lte: new Date(endDate) };
    }

    const entries = await GeneralLedger.find(query)
      .populate("journalEntryId", "entryNumber description entryType")
      .populate("createdBy", "firstName lastName email")
      .sort({ transactionDate: 1, createdAt: 1 })
      .lean();

    // Calculate running balance
    let runningBalance = 0;
    const account = await Account.findById(accountId);
    
    const entriesWithBalance = entries.map((entry: any) => {
      if (["asset", "expense"].includes(account?.accountType || "")) {
        runningBalance += entry.debit - entry.credit;
      } else {
        runningBalance += entry.credit - entry.debit;
      }
      
      return {
        ...entry,
        runningBalance,
      };
    });

    return { success: true, data: entriesWithBalance };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getTrialBalance(user: any, asOfDate?: string) {
  try {
    await connectToDB();

    const query: any = {
      organizationId: user.organizationId,
      del_flag: false,
      isActive: true,
    };

    const accounts = await Account.find(query).sort({ accountCode: 1 });

    const trialBalance = accounts.map((account) => ({
      accountCode: account.accountCode,
      accountName: account.accountName,
      accountType: account.accountType,
      debit: account.accountType === "asset" || account.accountType === "expense" 
        ? Math.max(0, account.currentBalance) 
        : 0,
      credit: account.accountType === "liability" || account.accountType === "equity" || account.accountType === "revenue"
        ? Math.max(0, account.currentBalance)
        : 0,
    }));

    const totalDebit = trialBalance.reduce((sum, acc) => sum + acc.debit, 0);
    const totalCredit = trialBalance.reduce((sum, acc) => sum + acc.credit, 0);

    return {
      success: true,
      data: {
        accounts: trialBalance,
        totalDebit,
        totalCredit,
        isBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
        asOfDate: asOfDate || new Date().toISOString(),
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getGeneralLedgerSummary(user: any) {
  try {
    await connectToDB();

    const totalEntries = await GeneralLedger.countDocuments({
      organizationId: user.organizationId,
      del_flag: false,
    });

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const monthlyEntries = await GeneralLedger.countDocuments({
      organizationId: user.organizationId,
      del_flag: false,
      fiscalYear: currentYear,
      fiscalPeriod: currentMonth,
    });

    const accounts = await Account.find({
      organizationId: user.organizationId,
      del_flag: false,
      isActive: true,
    });

    const totalDebit = accounts.reduce((sum, acc) => sum + acc.debitBalance, 0);
    const totalCredit = accounts.reduce((sum, acc) => sum + acc.creditBalance, 0);

    return {
      success: true,
      data: {
        totalEntries,
        monthlyEntries,
        totalDebit,
        totalCredit,
        isBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getGeneralLedger = await withAuth(_getGeneralLedger);
export const getAccountLedger = await withAuth(_getAccountLedger);
export const getTrialBalance = await withAuth(_getTrialBalance);
export const getGeneralLedgerSummary = await withAuth(_getGeneralLedgerSummary);
