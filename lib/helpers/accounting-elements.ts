"use server"

import { connectToDB } from "../connection/mongoose"
import Account from "../models/account.model"
import { currentUser } from "../helpers/session"

// Get balances by accounting element
export async function getAccountingElementBalances() {
  const user = await currentUser()
  if (!user) return null

  await connectToDB()

  const accounts = await Account.find({
    organizationId: user.organizationId,
    del_flag: false,
    isActive: true,
  }).lean()

  const balances = {
    assets: 0,
    liabilities: 0,
    equity: 0,
    revenue: 0,
    expenses: 0,
  }

  accounts.forEach((account) => {
    const balance = account.currentBalance || 0
    
    switch (account.accountType) {
      case "asset":
        balances.assets += balance
        break
      case "liability":
        balances.liabilities += balance
        break
      case "equity":
        balances.equity += balance
        break
      case "revenue":
        balances.revenue += balance
        break
      case "expense":
        balances.expenses += balance
        break
    }
  })

  return balances
}

// Verify accounting equation: Assets = Liabilities + Equity
export async function verifyAccountingEquation() {
  const balances = await getAccountingElementBalances()
  if (!balances) return { valid: false, error: "Unable to fetch balances" }

  const leftSide = balances.assets
  const rightSide = balances.liabilities + balances.equity
  const difference = Math.abs(leftSide - rightSide)
  const isBalanced = difference < 0.01 // Allow for rounding errors

  return {
    valid: isBalanced,
    assets: balances.assets,
    liabilities: balances.liabilities,
    equity: balances.equity,
    difference,
    equation: `${leftSide.toFixed(2)} = ${rightSide.toFixed(2)}`,
  }
}

// Calculate net income: Revenue - Expenses
export async function calculateNetIncome() {
  const balances = await getAccountingElementBalances()
  if (!balances) return null

  const netIncome = balances.revenue - balances.expenses

  return {
    revenue: balances.revenue,
    expenses: balances.expenses,
    netIncome,
    profitMargin: balances.revenue > 0 ? (netIncome / balances.revenue) * 100 : 0,
  }
}

// Get accounts by element type
export async function getAccountsByElement(elementType: "asset" | "liability" | "equity" | "revenue" | "expense") {
  const user = await currentUser()
  if (!user) return []

  await connectToDB()

  const accounts = await Account.find({
    organizationId: user.organizationId,
    accountType: elementType,
    del_flag: false,
    isActive: true,
  })
    .sort({ accountCode: 1 })
    .lean()

  return JSON.parse(JSON.stringify(accounts))
}

// Generate Balance Sheet (Assets, Liabilities, Equity)
export async function generateBalanceSheet() {
  const user = await currentUser()
  if (!user) return null

  const assets = await getAccountsByElement("asset")
  const liabilities = await getAccountsByElement("liability")
  const equity = await getAccountsByElement("equity")

  const totalAssets = assets.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0)
  const totalLiabilities = liabilities.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0)
  const totalEquity = equity.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0)

  return {
    assets: {
      accounts: assets,
      total: totalAssets,
    },
    liabilities: {
      accounts: liabilities,
      total: totalLiabilities,
    },
    equity: {
      accounts: equity,
      total: totalEquity,
    },
    totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
    isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01,
  }
}

// Generate Income Statement (Revenue, Expenses)
export async function generateIncomeStatement() {
  const user = await currentUser()
  if (!user) return null

  const revenue = await getAccountsByElement("revenue")
  const expenses = await getAccountsByElement("expense")

  const totalRevenue = revenue.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0)
  const totalExpenses = expenses.reduce((sum, acc) => sum + (acc.currentBalance || 0), 0)
  const netIncome = totalRevenue - totalExpenses

  return {
    revenue: {
      accounts: revenue,
      total: totalRevenue,
    },
    expenses: {
      accounts: expenses,
      total: totalExpenses,
    },
    netIncome,
    profitMargin: totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0,
  }
}
