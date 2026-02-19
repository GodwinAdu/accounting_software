"use server";

import { connectToDB } from "../connection/mongoose";
import Account from "../models/account.model";
import GeneralLedger from "../models/general-ledger.model";
import { withAuth } from "../helpers/auth";

async function _getTrialBalance(user: any, asOfDate?: string) {
  try {
    await connectToDB();

    const accounts = await Account.find({
      organizationId: user.organizationId,
      del_flag: false,
      isActive: true,
    }).sort({ accountCode: 1 });

    const trialBalance = accounts.map((account) => ({
      id: account._id,
      code: account.accountCode,
      account: account.accountName,
      accountType: account.accountType,
      debit: ["asset", "expense"].includes(account.accountType) && account.currentBalance > 0
        ? account.currentBalance
        : 0,
      credit: ["liability", "equity", "revenue"].includes(account.accountType) && account.currentBalance > 0
        ? account.currentBalance
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

async function _getBalanceSheet(user: any, asOfDate?: string) {
  try {
    await connectToDB();

    const accounts = await Account.find({
      organizationId: user.organizationId,
      del_flag: false,
      isActive: true,
    });

    const assets = accounts.filter((a) => a.accountType === "asset");
    const liabilities = accounts.filter((a) => a.accountType === "liability");
    const equity = accounts.filter((a) => a.accountType === "equity");

    const currentAssets = assets.filter((a) => a.accountSubType === "current-asset");
    const fixedAssets = assets.filter((a) => a.accountSubType === "fixed-asset");
    const currentLiabilities = liabilities.filter((a) => a.accountSubType === "current-liability");
    const longTermLiabilities = liabilities.filter((a) => a.accountSubType === "long-term-liability");

    const totalCurrentAssets = currentAssets.reduce((sum, a) => sum + a.currentBalance, 0);
    const totalFixedAssets = fixedAssets.reduce((sum, a) => sum + a.currentBalance, 0);
    const totalAssets = totalCurrentAssets + totalFixedAssets;

    const totalCurrentLiabilities = currentLiabilities.reduce((sum, a) => sum + a.currentBalance, 0);
    const totalLongTermLiabilities = longTermLiabilities.reduce((sum, a) => sum + a.currentBalance, 0);
    const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

    const totalEquity = equity.reduce((sum, a) => sum + a.currentBalance, 0);

    return {
      success: true,
      data: {
        currentAssets: currentAssets.map((a) => ({ name: a.accountName, amount: a.currentBalance })),
        fixedAssets: fixedAssets.map((a) => ({ name: a.accountName, amount: a.currentBalance })),
        currentLiabilities: currentLiabilities.map((a) => ({ name: a.accountName, amount: a.currentBalance })),
        longTermLiabilities: longTermLiabilities.map((a) => ({ name: a.accountName, amount: a.currentBalance })),
        equity: equity.map((a) => ({ name: a.accountName, amount: a.currentBalance })),
        totalCurrentAssets,
        totalFixedAssets,
        totalAssets,
        totalCurrentLiabilities,
        totalLongTermLiabilities,
        totalLiabilities,
        totalEquity,
        asOfDate: asOfDate || new Date().toISOString(),
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getProfitLoss(user: any, startDate?: string, endDate?: string) {
  try {
    await connectToDB();

    const accounts = await Account.find({
      organizationId: user.organizationId,
      del_flag: false,
      isActive: true,
      accountType: { $in: ["revenue", "expense"] },
    });

    const revenue = accounts.filter((a) => a.accountType === "revenue");
    const expenses = accounts.filter((a) => a.accountType === "expense");

    const totalRevenue = revenue.reduce((sum, a) => sum + a.currentBalance, 0);
    const totalExpenses = expenses.reduce((sum, a) => sum + a.currentBalance, 0);
    const netIncome = totalRevenue - totalExpenses;

    return {
      success: true,
      data: {
        revenue: revenue.map((a) => ({ name: a.accountName, amount: a.currentBalance })),
        expenses: expenses.map((a) => ({ name: a.accountName, amount: a.currentBalance })),
        totalRevenue,
        totalExpenses,
        netIncome,
        startDate: startDate || new Date(new Date().getFullYear(), 0, 1).toISOString(),
        endDate: endDate || new Date().toISOString(),
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getCashFlow(user: any, startDate?: string, endDate?: string) {
  try {
    await connectToDB();

    const query: any = {
      organizationId: user.organizationId,
      del_flag: false,
    };

    if (startDate) query.transactionDate = { $gte: new Date(startDate) };
    if (endDate) {
      query.transactionDate = { ...query.transactionDate, $lte: new Date(endDate) };
    }

    const transactions = await GeneralLedger.find(query)
      .populate("accountId", "accountName accountType accountSubType")
      .sort({ transactionDate: 1 });

    const operating = transactions.filter((t: any) => 
      ["revenue", "expense"].includes(t.accountId?.accountType)
    );
    const investing = transactions.filter((t: any) => 
      t.accountId?.accountSubType === "fixed-asset"
    );
    const financing = transactions.filter((t: any) => 
      ["long-term-liability", "equity"].includes(t.accountId?.accountSubType)
    );

    const operatingCash = operating.reduce((sum: number, t: any) => sum + t.debit - t.credit, 0);
    const investingCash = investing.reduce((sum: number, t: any) => sum + t.debit - t.credit, 0);
    const financingCash = financing.reduce((sum: number, t: any) => sum + t.debit - t.credit, 0);
    const netCashFlow = operatingCash + investingCash + financingCash;

    return {
      success: true,
      data: {
        operatingActivities: operating.map((t: any) => ({
          date: t.transactionDate,
          description: t.description,
          amount: t.debit - t.credit,
        })),
        investingActivities: investing.map((t: any) => ({
          date: t.transactionDate,
          description: t.description,
          amount: t.debit - t.credit,
        })),
        financingActivities: financing.map((t: any) => ({
          date: t.transactionDate,
          description: t.description,
          amount: t.debit - t.credit,
        })),
        operatingCash,
        investingCash,
        financingCash,
        netCashFlow,
        startDate: startDate || new Date(new Date().getFullYear(), 0, 1).toISOString(),
        endDate: endDate || new Date().toISOString(),
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getARAgingReport(user: any) {
  try {
    await connectToDB();

    const Invoice = (await import("../models/invoice.model")).default;
    const invoices = await Invoice.find({
      organizationId: user.organizationId,
      del_flag: false,
      status: { $in: ["sent", "overdue", "partial"] },
    }).populate("customerId", "name");

    const today = new Date();
    const agingData = invoices.map((inv: any) => {
      const dueDate = new Date(inv.dueDate);
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      const balance = inv.total - inv.paidAmount;

      return {
        id: inv._id,
        customer: inv.customerId?.name || "Unknown",
        current: daysOverdue <= 0 ? balance : 0,
        days30: daysOverdue > 0 && daysOverdue <= 30 ? balance : 0,
        days60: daysOverdue > 30 && daysOverdue <= 60 ? balance : 0,
        days90: daysOverdue > 60 && daysOverdue <= 90 ? balance : 0,
        over90: daysOverdue > 90 ? balance : 0,
        total: balance,
      };
    });

    const grouped = agingData.reduce((acc: any, item: any) => {
      if (!acc[item.customer]) {
        acc[item.customer] = {
          id: item.id,
          customer: item.customer,
          current: 0,
          days30: 0,
          days60: 0,
          days90: 0,
          over90: 0,
          total: 0,
        };
      }
      acc[item.customer].current += item.current;
      acc[item.customer].days30 += item.days30;
      acc[item.customer].days60 += item.days60;
      acc[item.customer].days90 += item.days90;
      acc[item.customer].over90 += item.over90;
      acc[item.customer].total += item.total;
      return acc;
    }, {});

    return { success: true, data: Object.values(grouped) };
  } catch (error: any) {
    return { error: error.message };
  }
}

async function _getAPAgingReport(user: any) {
  try {
    await connectToDB();

    const Bill = (await import("../models/bill.model")).default;
    const bills = await Bill.find({
      organizationId: user.organizationId,
      del_flag: false,
      status: { $in: ["pending", "overdue", "partial"] },
    }).populate("vendorId", "name");

    const today = new Date();
    const agingData = bills.map((bill: any) => {
      const dueDate = new Date(bill.dueDate);
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      const balance = bill.total - bill.paidAmount;

      return {
        id: bill._id,
        vendor: bill.vendorId?.name || "Unknown",
        current: daysOverdue <= 0 ? balance : 0,
        days30: daysOverdue > 0 && daysOverdue <= 30 ? balance : 0,
        days60: daysOverdue > 30 && daysOverdue <= 60 ? balance : 0,
        days90: daysOverdue > 60 && daysOverdue <= 90 ? balance : 0,
        over90: daysOverdue > 90 ? balance : 0,
        total: balance,
      };
    });

    const grouped = agingData.reduce((acc: any, item: any) => {
      if (!acc[item.vendor]) {
        acc[item.vendor] = {
          id: item.id,
          vendor: item.vendor,
          current: 0,
          days30: 0,
          days60: 0,
          days90: 0,
          over90: 0,
          total: 0,
        };
      }
      acc[item.vendor].current += item.current;
      acc[item.vendor].days30 += item.days30;
      acc[item.vendor].days60 += item.days60;
      acc[item.vendor].days90 += item.days90;
      acc[item.vendor].over90 += item.over90;
      acc[item.vendor].total += item.total;
      return acc;
    }, {});

    return { success: true, data: Object.values(grouped) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getTrialBalance = await withAuth(_getTrialBalance);

export const getBalanceSheet = await withAuth(_getBalanceSheet);

export const getProfitLoss = await withAuth(_getProfitLoss);

export const getCashFlow = await withAuth(_getCashFlow);

export const getARAgingReport = await withAuth(_getARAgingReport);

export const getAPAgingReport = await withAuth(_getAPAgingReport);
