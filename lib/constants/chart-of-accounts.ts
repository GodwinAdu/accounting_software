// Standard Chart of Accounts Template - Works for any business type

export const ACCOUNT_TYPES = {
  ASSET: "asset",
  LIABILITY: "liability",
  EQUITY: "equity",
  REVENUE: "revenue",
  EXPENSE: "expense",
} as const

export const ACCOUNT_SUBTYPES = {
  // ASSETS
  CURRENT_ASSET: "Current Asset",
  CASH: "Cash & Cash Equivalents",
  ACCOUNTS_RECEIVABLE: "Accounts Receivable",
  INVENTORY: "Inventory",
  PREPAID_EXPENSES: "Prepaid Expenses",
  FIXED_ASSET: "Fixed Asset",
  PROPERTY: "Property, Plant & Equipment",
  ACCUMULATED_DEPRECIATION: "Accumulated Depreciation",
  INTANGIBLE_ASSET: "Intangible Asset",
  
  // LIABILITIES
  CURRENT_LIABILITY: "Current Liability",
  ACCOUNTS_PAYABLE: "Accounts Payable",
  SHORT_TERM_LOAN: "Short-term Loan",
  ACCRUED_EXPENSES: "Accrued Expenses",
  UNEARNED_REVENUE: "Unearned Revenue",
  LONG_TERM_LIABILITY: "Long-term Liability",
  
  // EQUITY
  OWNERS_EQUITY: "Owner's Equity",
  CAPITAL: "Capital",
  RETAINED_EARNINGS: "Retained Earnings",
  DRAWINGS: "Drawings/Dividends",
  
  // REVENUE
  OPERATING_REVENUE: "Operating Revenue",
  SALES_REVENUE: "Sales Revenue",
  SERVICE_REVENUE: "Service Revenue",
  OTHER_INCOME: "Other Income",
  
  // EXPENSES
  COST_OF_GOODS_SOLD: "Cost of Goods Sold",
  OPERATING_EXPENSE: "Operating Expense",
  SALARIES_WAGES: "Salaries & Wages",
  RENT_EXPENSE: "Rent Expense",
  UTILITIES: "Utilities",
  DEPRECIATION: "Depreciation Expense",
  INTEREST_EXPENSE: "Interest Expense",
  TAX_EXPENSE: "Tax Expense",
} as const

export const STANDARD_CHART_OF_ACCOUNTS = [
  // ASSETS
  { code: "1000", name: "Assets", type: "asset", subType: "Current Asset", isParent: true, level: 0 },
  { code: "1100", name: "Current Assets", type: "asset", subType: "Current Asset", isParent: true, level: 1, parent: "1000" },
  { code: "1110", name: "Cash", type: "asset", subType: "Cash & Cash Equivalents", level: 2, parent: "1100" },
  { code: "1120", name: "Bank Account", type: "asset", subType: "Cash & Cash Equivalents", level: 2, parent: "1100" },
  { code: "1200", name: "Accounts Receivable", type: "asset", subType: "Accounts Receivable", level: 2, parent: "1100" },
  { code: "1300", name: "Inventory", type: "asset", subType: "Inventory", level: 2, parent: "1100" },
  { code: "1500", name: "Fixed Assets", type: "asset", subType: "Fixed Asset", isParent: true, level: 1, parent: "1000" },
  { code: "1510", name: "Property", type: "asset", subType: "Property, Plant & Equipment", level: 2, parent: "1500" },
  { code: "1520", name: "Equipment", type: "asset", subType: "Property, Plant & Equipment", level: 2, parent: "1500" },
  { code: "1550", name: "Accumulated Depreciation", type: "asset", subType: "Accumulated Depreciation", level: 2, parent: "1500" },
  
  // LIABILITIES
  { code: "2000", name: "Liabilities", type: "liability", subType: "Current Liability", isParent: true, level: 0 },
  { code: "2100", name: "Current Liabilities", type: "liability", subType: "Current Liability", isParent: true, level: 1, parent: "2000" },
  { code: "2110", name: "Accounts Payable", type: "liability", subType: "Accounts Payable", level: 2, parent: "2100" },
  { code: "2130", name: "Accrued Expenses", type: "liability", subType: "Accrued Expenses", level: 2, parent: "2100" },
  { code: "2200", name: "Long-term Liabilities", type: "liability", subType: "Long-term Liability", isParent: true, level: 1, parent: "2000" },
  { code: "2210", name: "Long-term Loan", type: "liability", subType: "Long-term Liability", level: 2, parent: "2200" },
  
  // EQUITY
  { code: "3000", name: "Equity", type: "equity", subType: "Owner's Equity", isParent: true, level: 0 },
  { code: "3100", name: "Owner's Capital", type: "equity", subType: "Capital", level: 1, parent: "3000" },
  { code: "3200", name: "Retained Earnings", type: "equity", subType: "Retained Earnings", level: 1, parent: "3000" },
  
  // REVENUE
  { code: "4000", name: "Revenue", type: "revenue", subType: "Operating Revenue", isParent: true, level: 0 },
  { code: "4100", name: "Sales Revenue", type: "revenue", subType: "Sales Revenue", level: 1, parent: "4000" },
  { code: "4200", name: "Service Revenue", type: "revenue", subType: "Service Revenue", level: 1, parent: "4000" },
  { code: "4300", name: "Other Income", type: "revenue", subType: "Other Income", level: 1, parent: "4000" },
  
  // EXPENSES
  { code: "5000", name: "Expenses", type: "expense", subType: "Operating Expense", isParent: true, level: 0 },
  { code: "5100", name: "Cost of Goods Sold", type: "expense", subType: "Cost of Goods Sold", level: 1, parent: "5000" },
  { code: "5200", name: "Operating Expenses", type: "expense", subType: "Operating Expense", isParent: true, level: 1, parent: "5000" },
  { code: "5210", name: "Salaries & Wages", type: "expense", subType: "Salaries & Wages", level: 2, parent: "5200" },
  { code: "5220", name: "Rent Expense", type: "expense", subType: "Rent Expense", level: 2, parent: "5200" },
  { code: "5230", name: "Utilities", type: "expense", subType: "Utilities", level: 2, parent: "5200" },
  { code: "5300", name: "Interest Expense", type: "expense", subType: "Interest Expense", level: 1, parent: "5000" },
  { code: "5400", name: "Tax Expense", type: "expense", subType: "Tax Expense", level: 1, parent: "5000" },
]
