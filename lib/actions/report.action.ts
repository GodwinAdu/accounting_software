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

    const trialBalance = accounts.map((account) => {
      let debit = 0;
      let credit = 0;
      
      if (["asset", "expense"].includes(account.accountType)) {
        if (account.currentBalance > 0) {
          debit = account.currentBalance;
        } else if (account.currentBalance < 0) {
          credit = Math.abs(account.currentBalance);
        }
      } else {
        if (account.currentBalance > 0) {
          credit = account.currentBalance;
        } else if (account.currentBalance < 0) {
          debit = Math.abs(account.currentBalance);
        }
      }
      
      return {
        id: String(account._id),
        code: account.accountCode,
        account: account.accountName,
        accountType: account.accountType,
        debit,
        credit
      };
    });

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
    }).sort({ accountCode: 1 });

    // Helper function to calculate total balance including children
    const accountMap = new Map();
    accounts.forEach((a: any) => {
      accountMap.set(String(a._id), {
        id: a._id,
        name: a.accountName,
        type: a.accountType,
        subType: a.accountSubType,
        balance: a.currentBalance,
        parentId: a.parentAccountId,
        children: []
      });
    });

    accountMap.forEach((account) => {
      if (account.parentId) {
        const parent = accountMap.get(String(account.parentId));
        if (parent) parent.children.push(account);
      }
    });

    function getTotalBalance(account: any): number {
      let total = account.balance;
      account.children.forEach((child: any) => {
        total += getTotalBalance(child);
      });
      return total;
    }

    // Get leaf accounts only (accounts without children)
    const leafAccounts = Array.from(accountMap.values()).filter((a: any) => a.children.length === 0);

    // Assets
    const assetAccounts = leafAccounts.filter((a: any) => a.type === "asset");
    const currentAssets = assetAccounts
      .filter((a: any) => 
        a.subType?.toLowerCase().includes("current") ||
        a.subType?.toLowerCase().includes("cash") ||
        a.subType?.toLowerCase().includes("bank") ||
        a.subType?.toLowerCase().includes("receivable") ||
        a.subType?.toLowerCase().includes("inventory")
      )
      .map((a: any) => ({ name: a.name, amount: a.balance }))
      .filter((a: any) => a.amount !== 0);

    const fixedAssets = assetAccounts
      .filter((a: any) => 
        a.subType?.toLowerCase().includes("fixed") ||
        a.subType?.toLowerCase().includes("property") ||
        a.subType?.toLowerCase().includes("equipment") ||
        a.subType?.toLowerCase().includes("vehicle")
      )
      .map((a: any) => ({ name: a.name, amount: a.balance }))
      .filter((a: any) => a.amount !== 0);

    const otherAssets = assetAccounts
      .filter((a: any) => {
        const subType = a.subType?.toLowerCase() || "";
        return !subType.includes("current") && !subType.includes("cash") && 
               !subType.includes("bank") && !subType.includes("receivable") &&
               !subType.includes("inventory") && !subType.includes("fixed") &&
               !subType.includes("property") && !subType.includes("equipment") &&
               !subType.includes("vehicle");
      })
      .map((a: any) => ({ name: a.name, amount: a.balance }))
      .filter((a: any) => a.amount !== 0);

    const totalCurrentAssets = currentAssets.reduce((sum, a) => sum + a.amount, 0);
    const totalFixedAssets = fixedAssets.reduce((sum, a) => sum + a.amount, 0);
    const totalOtherAssets = otherAssets.reduce((sum, a) => sum + a.amount, 0);
    const totalAssets = totalCurrentAssets + totalFixedAssets + totalOtherAssets;

    // Liabilities
    const liabilityAccounts = leafAccounts.filter((a: any) => a.type === "liability");
    const currentLiabilities = liabilityAccounts
      .filter((a: any) => 
        a.subType?.toLowerCase().includes("current") ||
        a.subType?.toLowerCase().includes("payable") ||
        a.subType?.toLowerCase().includes("short")
      )
      .map((a: any) => ({ name: a.name, amount: a.balance }))
      .filter((a: any) => a.amount !== 0);

    const longTermLiabilities = liabilityAccounts
      .filter((a: any) => 
        a.subType?.toLowerCase().includes("long") ||
        a.subType?.toLowerCase().includes("mortgage") ||
        a.subType?.toLowerCase().includes("note")
      )
      .map((a: any) => ({ name: a.name, amount: a.balance }))
      .filter((a: any) => a.amount !== 0);

    const otherLiabilities = liabilityAccounts
      .filter((a: any) => {
        const subType = a.subType?.toLowerCase() || "";
        return !subType.includes("current") && !subType.includes("payable") &&
               !subType.includes("short") && !subType.includes("long") &&
               !subType.includes("mortgage") && !subType.includes("note");
      })
      .map((a: any) => ({ name: a.name, amount: a.balance }))
      .filter((a: any) => a.amount !== 0);

    const totalCurrentLiabilities = currentLiabilities.reduce((sum, a) => sum + a.amount, 0);
    const totalLongTermLiabilities = longTermLiabilities.reduce((sum, a) => sum + a.amount, 0);
    const totalOtherLiabilities = otherLiabilities.reduce((sum, a) => sum + a.amount, 0);
    const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities + totalOtherLiabilities;

    // Equity
    const equityAccounts = leafAccounts.filter((a: any) => a.type === "equity");
    const equity = equityAccounts
      .map((a: any) => ({ name: a.name, amount: a.balance }))
      .filter((a: any) => a.amount !== 0);
    
    // Calculate Retained Earnings (Net Income)
    const revenueAccounts = leafAccounts.filter((a: any) => a.type === "revenue");
    const expenseAccounts = leafAccounts.filter((a: any) => a.type === "expense");
    const totalRevenue = revenueAccounts.reduce((sum, a) => sum + a.balance, 0);
    const totalExpenses = expenseAccounts.reduce((sum, a) => sum + a.balance, 0);
    const retainedEarnings = totalRevenue - totalExpenses;
    
    // Add Retained Earnings to equity if not zero
    if (retainedEarnings !== 0) {
      equity.push({ name: "Retained Earnings (Current Period)", amount: retainedEarnings });
    }
    
    const totalEquity = equity.reduce((sum, a) => sum + a.amount, 0);

    return {
      success: true,
      data: {
        currentAssets,
        fixedAssets,
        otherAssets,
        currentLiabilities,
        longTermLiabilities,
        otherLiabilities,
        equity,
        totalCurrentAssets,
        totalFixedAssets,
        totalOtherAssets,
        totalAssets,
        totalCurrentLiabilities,
        totalLongTermLiabilities,
        totalOtherLiabilities,
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
    }).sort({ accountCode: 1 });

    // Calculate balances with parent rollup
    const accountMap = new Map();
    accounts.forEach((a: any) => {
      accountMap.set(String(a._id), {
        id: a._id,
        name: a.accountName,
        type: a.accountType,
        level: a.level,
        parentId: a.parentAccountId,
        balance: a.currentBalance,
        children: []
      });
    });

    // Build hierarchy and calculate parent balances
    accountMap.forEach((account) => {
      if (account.parentId) {
        const parent = accountMap.get(String(account.parentId));
        if (parent) {
          parent.children.push(account);
        }
      }
    });

    // Recursive function to calculate total balance including children
    function getTotalBalance(account: any): number {
      let total = account.balance;
      account.children.forEach((child: any) => {
        total += getTotalBalance(child);
      });
      return total;
    }

    // Get accounts with calculated balances
    const revenue = Array.from(accountMap.values())
      .filter((a: any) => a.type === "revenue")
      .map((a: any) => ({
        name: a.name,
        amount: getTotalBalance(a),
        level: a.level,
        hasChildren: a.children.length > 0
      }))
      .filter((a: any) => a.amount !== 0);

    const expenses = Array.from(accountMap.values())
      .filter((a: any) => a.type === "expense")
      .map((a: any) => ({
        name: a.name,
        amount: getTotalBalance(a),
        level: a.level,
        hasChildren: a.children.length > 0
      }))
      .filter((a: any) => a.amount !== 0);

    // Only sum leaf accounts (accounts without children) to avoid double counting
    const totalRevenue = revenue
      .filter((a: any) => !a.hasChildren)
      .reduce((sum, a) => sum + a.amount, 0);
    const totalExpenses = expenses
      .filter((a: any) => !a.hasChildren)
      .reduce((sum, a) => sum + a.amount, 0);
    const netIncome = totalRevenue - totalExpenses;

    return {
      success: true,
      data: {
        revenue,
        expenses,
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

    const Invoice = (await import("../models/invoice.model")).default;
    const Payment = (await import("../models/payment.model")).default;
    const Expense = (await import("../models/expense.model")).default;
    const Bill = (await import("../models/bill.model")).default;
    const GeneralLedger = (await import("../models/general-ledger.model")).default;
    const Account = (await import("../models/account.model")).default;

    const dateFilter = startDate && endDate ? {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    } : {};

    // Operating Activities
    const operatingActivities = [];

    // Cash received from customers (invoice payments)
    const payments = await Payment.find({
      organizationId: user.organizationId,
      del_flag: false,
      ...(Object.keys(dateFilter).length > 0 && { paymentDate: dateFilter })
    });
    const cashFromCustomers = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    if (cashFromCustomers > 0) {
      operatingActivities.push({ description: "Cash received from customers", amount: cashFromCustomers });
    }

    // Cash paid for expenses
    const paidExpenses = await Expense.find({
      organizationId: user.organizationId,
      del_flag: false,
      status: "paid",
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
    });
    const expensesPaid = paidExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    if (expensesPaid > 0) {
      operatingActivities.push({ description: "Cash paid for operating expenses", amount: -expensesPaid });
    }

    // Cash paid for bills (using amountPaid field)
    const billsWithPayments = await Bill.find({
      organizationId: user.organizationId,
      del_flag: false,
      amountPaid: { $gt: 0 },
      ...(Object.keys(dateFilter).length > 0 && { billDate: dateFilter })
    });
    const billsPaid = billsWithPayments.reduce((sum, b) => sum + (b.amountPaid || 0), 0);
    if (billsPaid > 0) {
      operatingActivities.push({ description: "Cash paid to suppliers", amount: -billsPaid });
    }

    const operatingCash = cashFromCustomers - expensesPaid - billsPaid;

    // Investing Activities (fixed assets)
    const investingActivities = [];
    
    const fixedAssetAccounts = await Account.find({
      organizationId: user.organizationId,
      accountType: "asset",
      accountSubType: { $regex: /fixed|property|equipment|vehicle/i },
      del_flag: false
    });
    
    if (fixedAssetAccounts.length > 0) {
      const fixedAssetIds = fixedAssetAccounts.map(a => a._id);
      const fixedAssetTransactions = await GeneralLedger.find({
        organizationId: user.organizationId,
        accountId: { $in: fixedAssetIds },
        del_flag: false,
        ...(Object.keys(dateFilter).length > 0 && { transactionDate: dateFilter })
      });
      
      const assetPurchases = fixedAssetTransactions.reduce((sum, t) => sum + (t.debit || 0), 0);
      const assetSales = fixedAssetTransactions.reduce((sum, t) => sum + (t.credit || 0), 0);
      
      if (assetPurchases > 0) {
        investingActivities.push({ description: "Purchase of fixed assets", amount: -assetPurchases });
      }
      if (assetSales > 0) {
        investingActivities.push({ description: "Proceeds from sale of assets", amount: assetSales });
      }
    }
    
    const investingCash = investingActivities.reduce((sum, a) => sum + a.amount, 0);

    // Financing Activities (loans, equity)
    const financingActivities = [];
    
    const loanAccounts = await Account.find({
      organizationId: user.organizationId,
      accountType: "liability",
      accountSubType: { $regex: /loan|mortgage|note|long/i },
      del_flag: false
    });
    
    if (loanAccounts.length > 0) {
      const loanIds = loanAccounts.map(a => a._id);
      const loanTransactions = await GeneralLedger.find({
        organizationId: user.organizationId,
        accountId: { $in: loanIds },
        del_flag: false,
        ...(Object.keys(dateFilter).length > 0 && { transactionDate: dateFilter })
      });
      
      const loanProceeds = loanTransactions.reduce((sum, t) => sum + (t.credit || 0), 0);
      const loanRepayments = loanTransactions.reduce((sum, t) => sum + (t.debit || 0), 0);
      
      if (loanProceeds > 0) {
        financingActivities.push({ description: "Proceeds from borrowings", amount: loanProceeds });
      }
      if (loanRepayments > 0) {
        financingActivities.push({ description: "Repayment of borrowings", amount: -loanRepayments });
      }
    }
    
    // Equity transactions
    const equityAccounts = await Account.find({
      organizationId: user.organizationId,
      accountType: "equity",
      del_flag: false
    });
    
    if (equityAccounts.length > 0) {
      const equityIds = equityAccounts.map(a => a._id);
      const equityTransactions = await GeneralLedger.find({
        organizationId: user.organizationId,
        accountId: { $in: equityIds },
        del_flag: false,
        referenceType: { $ne: "closing" },
        ...(Object.keys(dateFilter).length > 0 && { transactionDate: dateFilter })
      });
      
      const equityInvestments = equityTransactions.reduce((sum, t) => sum + (t.credit || 0), 0);
      const equityWithdrawals = equityTransactions.reduce((sum, t) => sum + (t.debit || 0), 0);
      
      if (equityInvestments > 0) {
        financingActivities.push({ description: "Owner investments", amount: equityInvestments });
      }
      if (equityWithdrawals > 0) {
        financingActivities.push({ description: "Owner withdrawals", amount: -equityWithdrawals });
      }
    }
    
    const financingCash = financingActivities.reduce((sum, a) => sum + a.amount, 0);

    const netCashFlow = operatingCash + investingCash + financingCash;

    return {
      success: true,
      data: {
        operatingActivities,
        investingActivities,
        financingActivities,
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

    if (!invoices || invoices.length === 0) {
      return { success: true, data: [] };
    }

    const today = new Date();
    const agingData = invoices.map((inv: any) => {
      const dueDate = new Date(inv.dueDate);
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalAmount = Number(inv.totalAmount) || 0;
      const paidAmount = Number(inv.paidAmount) || 0;
      const balance = totalAmount - paidAmount;

      return {
        id: String(inv._id),
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
      acc[item.customer].current += Number(item.current) || 0;
      acc[item.customer].days30 += Number(item.days30) || 0;
      acc[item.customer].days60 += Number(item.days60) || 0;
      acc[item.customer].days90 += Number(item.days90) || 0;
      acc[item.customer].over90 += Number(item.over90) || 0;
      acc[item.customer].total += Number(item.total) || 0;
      return acc;
    }, {});

    return { success: true, data: Object.values(grouped) };
  } catch (error: any) {
    console.error("AR Aging Report Error:", error);
    return { success: false, error: error.message, data: [] };
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
      const totalAmount = bill.totalAmount || bill.total || 0;
      const paidAmount = bill.amountPaid || bill.paidAmount || 0;
      const balance = totalAmount - paidAmount;

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
      acc[item.vendor].current += item.current || 0;
      acc[item.vendor].days30 += item.days30 || 0;
      acc[item.vendor].days60 += item.days60 || 0;
      acc[item.vendor].days90 += item.days90 || 0;
      acc[item.vendor].over90 += item.over90 || 0;
      acc[item.vendor].total += item.total || 0;
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
