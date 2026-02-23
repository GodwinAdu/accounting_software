"use server";

import { connectToDB } from "../connection/mongoose";
import { withAuth } from "../helpers/auth";

async function _getDashboardStats(user: any, startDate?: Date, endDate?: Date) {
  try {
    await connectToDB();

    const Invoice = (await import("../models/invoice.model")).default;
    const Bill = (await import("../models/bill.model")).default;
    const Expense = (await import("../models/expense.model")).default;
    const Employee = (await import("../models/employee.model")).default;
    const BankAccount = (await import("../models/bank-account.model")).default;
    const BankTransaction = (await import("../models/bank-transaction.model")).default;
    const Account = (await import("../models/account.model")).default;
    const Customer = (await import("../models/customer.model")).default;
    const Vendor = (await import("../models/vendor.model")).default;
    const PayrollRun = (await import("../models/payroll-run.model")).default;

    const dateFilter = startDate && endDate ? {
      createdAt: { $gte: startDate, $lte: endDate }
    } : {};

    // Revenue (from invoices)
    const invoices = await Invoice.find({
      organizationId: user.organizationId,
      del_flag: false,
      ...dateFilter,
    }).populate("customerId", "name");
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const paidRevenue = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);

    // Expenses (from bills and expenses)
    const bills = await Bill.find({
      organizationId: user.organizationId,
      del_flag: false,
      ...dateFilter,
    }).populate("vendorId", "name");
    const billsTotal = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);

    const expenses = await Expense.find({
      organizationId: user.organizationId,
      del_flag: false,
      ...dateFilter,
    });
    const expensesTotal = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    const totalExpenses = billsTotal + expensesTotal;

    // Net Profit
    const netProfit = paidRevenue - totalExpenses;

    // Employees
    const employees = await Employee.find({
      organizationId: user.organizationId,
      del_flag: false,
      status: "active",
    });
    const activeEmployees = employees.length;

    // Pending Invoices
    const pendingInvoices = invoices.filter((inv) => inv.status === "sent" || inv.status === "overdue");
    const pendingInvoicesAmount = pendingInvoices.reduce((sum, inv) => sum + ((inv.totalAmount || 0) - (inv.paidAmount || 0)), 0);

    // Unpaid Bills
    const unpaidBills = bills.filter((bill) => bill.status === "pending" || bill.status === "overdue");
    const unpaidBillsAmount = unpaidBills.reduce((sum, bill) => sum + ((bill.totalAmount || 0) - (bill.paidAmount || 0)), 0);

    // Bank Balance
    const bankAccounts = await BankAccount.find({
      organizationId: user.organizationId,
      del_flag: false,
      isActive: true,
    });
    const totalBankBalance = bankAccounts.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);

    // Recent Transactions (last 5)
    const recentTransactions = await BankTransaction.find({
      organizationId: user.organizationId,
      del_flag: false,
      ...dateFilter,
    })
      .sort({ transactionDate: -1 })
      .limit(5)
      .lean();

    // Top Customers (by total invoice amount)
    const customerStats = await Invoice.aggregate([
      { $match: { organizationId: user.organizationId, del_flag: false, ...dateFilter } },
      { $group: { _id: "$customerId", totalAmount: { $sum: "$totalAmount" } } },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 },
    ]);
    const topCustomerIds = customerStats.map((c) => c._id);
    const topCustomers = await Customer.find({ _id: { $in: topCustomerIds } }).lean();
    const topCustomersData = customerStats.map((stat) => {
      const customer = topCustomers.find((c) => c._id.toString() === stat._id.toString());
      return {
        _id: stat._id,
        name: customer?.name || "Unknown",
        amount: stat.totalAmount,
      };
    });

    // Top Vendors (by total bill amount)
    const vendorStats = await Bill.aggregate([
      { $match: { organizationId: user.organizationId, del_flag: false, ...dateFilter } },
      { $group: { _id: "$vendorId", totalAmount: { $sum: "$totalAmount" } } },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 },
    ]);
    const topVendorIds = vendorStats.map((v) => v._id);
    const topVendors = await Vendor.find({ _id: { $in: topVendorIds } }).lean();
    const topVendorsData = vendorStats.map((stat) => {
      const vendor = topVendors.find((v) => v._id.toString() === stat._id.toString());
      return {
        _id: stat._id,
        name: vendor?.name || "Unknown",
        amount: stat.totalAmount,
      };
    });

    // Payroll Expenses (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    // Payroll Expenses
    const payrollFilter = startDate && endDate ? {
      startDate: { $gte: startDate, $lte: endDate }
    } : {
      startDate: { $gte: sixMonthsAgo }
    };
    const payrollRuns = await PayrollRun.find({
      organizationId: user.organizationId,
      del_flag: false,
      ...payrollFilter,
    })
      .sort({ startDate: 1 })
      .lean();

    // Account Health (from Chart of Accounts)
    const accounts = await Account.find({
      organizationId: user.organizationId,
      del_flag: false,
      isActive: true,
    });

    const assets = accounts.filter((a) => a.accountType === "asset");
    const liabilities = accounts.filter((a) => a.accountType === "liability");
    const totalAssets = assets.reduce((sum, a) => sum + (a.currentBalance || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, a) => sum + (a.currentBalance || 0), 0);

    // Monthly Revenue vs Expenses (last 6 months)
    const monthlyData = [];
    const cashFlowData = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);

      const monthInvoices = await Invoice.find({
        organizationId: user.organizationId,
        del_flag: false,
        invoiceDate: { $gte: monthStart, $lte: monthEnd },
      });
      const monthRevenue = monthInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
      const monthInflow = monthInvoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);

      const monthBills = await Bill.find({
        organizationId: user.organizationId,
        del_flag: false,
        createdAt: { $gte: monthStart, $lte: monthEnd },
      });
      const monthBillsTotal = monthBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
      const monthBillsPaid = monthBills.reduce((sum, bill) => sum + (bill.paidAmount || 0), 0);

      const monthExpenses = await Expense.find({
        organizationId: user.organizationId,
        del_flag: false,
        date: { $gte: monthStart, $lte: monthEnd },
      });
      const monthExpensesTotal = monthExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
      const monthExpensesPaid = monthExpenses.filter(exp => exp.status === "paid").reduce((sum, exp) => sum + (exp.amount || 0), 0);

      const monthOutflow = monthBillsPaid + monthExpensesPaid;

      monthlyData.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short" }),
        revenue: monthRevenue,
        expenses: monthBillsTotal + monthExpensesTotal,
      });

      cashFlowData.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short" }),
        inflow: monthInflow,
        outflow: monthOutflow,
      });
    }

    return {
      success: true,
      data: {
        totalRevenue,
        totalExpenses,
        netProfit,
        activeEmployees,
        pendingInvoices: {
          count: pendingInvoices.length,
          amount: pendingInvoicesAmount,
        },
        unpaidBills: {
          count: unpaidBills.length,
          amount: unpaidBillsAmount,
        },
        bankBalance: {
          total: totalBankBalance,
          accounts: bankAccounts.length,
        },
        accountHealth: {
          totalAssets,
          totalLiabilities,
          equity: totalAssets - totalLiabilities,
        },
        recentTransactions: recentTransactions.map((t) => ({
          _id: t._id,
          description: t.description,
          amount: t.amount,
          transactionType: t.transactionType,
          transactionDate: t.transactionDate,
        })),
        topCustomers: topCustomersData,
        topVendors: topVendorsData,
        payrollRuns: payrollRuns.map((p) => ({
          _id: p._id,
          payPeriodStart: p.startDate,
          totalNetPay: p.totalNetPay,
        })),
        monthlyRevenueExpenses: monthlyData,
        cashFlowData,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

export const getDashboardStats = await withAuth(_getDashboardStats);
