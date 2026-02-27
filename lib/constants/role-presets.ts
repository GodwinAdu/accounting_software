// lib/constants/role-presets.ts

export const ROLE_PRESETS = {
  ADMIN: {
    name: "admin",
    displayName: "Administrator",
    description: "Full access to all features",
    permissions: {
      // Grant all permissions
      dashboard_view: true,
      // ... (all permissions set to true)
    }
  },
  
  ACCOUNTANT: {
    name: "accountant",
    displayName: "Accountant",
    description: "Full accounting access, read-only for other modules",
    permissions: {
      dashboard_view: true,
      
      // Full accounting access
      accounting_view: true,
      chartOfAccounts_create: true,
      chartOfAccounts_view: true,
      chartOfAccounts_update: true,
      journalEntries_create: true,
      journalEntries_view: true,
      journalEntries_update: true,
      generalLedger_view: true,
      periodClose_create: true,
      periodClose_view: true,
      
      // Banking view only
      banking_view: true,
      bankAccounts_view: true,
      transactions_view: true,
      reconciliation_view: true,
      
      // Reports access
      reports_view: true,
      profitLoss_view: true,
      balanceSheet_view: true,
      cashFlow_view: true,
      trialBalance_view: true,
      
      // Tax access
      tax_view: true,
      taxSettings_view: true,
      taxReports_view: true,
    }
  },
  
  BOOKKEEPER: {
    name: "bookkeeper",
    displayName: "Bookkeeper",
    description: "Day-to-day transaction entry",
    permissions: {
      dashboard_view: true,
      
      // Banking
      banking_view: true,
      transactions_create: true,
      transactions_view: true,
      transactions_update: true,
      reconciliation_create: true,
      reconciliation_view: true,
      
      // Sales
      sales_view: true,
      invoices_create: true,
      invoices_view: true,
      invoices_update: true,
      customers_view: true,
      
      // Expenses
      expenses_view: true,
      expenses_create: true,
      expenses_update: true,
      bills_create: true,
      bills_view: true,
      vendors_view: true,
      
      // Basic reports
      reports_view: true,
      profitLoss_view: true,
      balanceSheet_view: true,
    }
  },
  
  SALES_MANAGER: {
    name: "sales_manager",
    displayName: "Sales Manager",
    description: "Full sales and customer management",
    permissions: {
      dashboard_view: true,
      
      // Full sales access
      sales_view: true,
      invoices_create: true,
      invoices_view: true,
      invoices_update: true,
      invoices_delete: true,
      estimates_create: true,
      estimates_view: true,
      estimates_update: true,
      customers_create: true,
      customers_view: true,
      customers_update: true,
      paymentsReceived_create: true,
      paymentsReceived_view: true,
      
      // CRM
      crm_view: true,
      leads_create: true,
      leads_view: true,
      leads_update: true,
      opportunities_create: true,
      opportunities_view: true,
      opportunities_update: true,
      
      // Reports
      reports_view: true,
      arAging_view: true,
    }
  },
  
  VIEWER: {
    name: "viewer",
    displayName: "Viewer",
    description: "Read-only access to reports and data",
    permissions: {
      dashboard_view: true,
      
      // View only
      banking_view: true,
      bankAccounts_view: true,
      transactions_view: true,
      
      sales_view: true,
      invoices_view: true,
      customers_view: true,
      
      expenses_view: true,
      bills_view: true,
      vendors_view: true,
      
      accounting_view: true,
      chartOfAccounts_view: true,
      generalLedger_view: true,
      
      reports_view: true,
      profitLoss_view: true,
      balanceSheet_view: true,
      cashFlow_view: true,
    }
  },
  
  EMPLOYEE: {
    name: "employee",
    displayName: "Employee",
    description: "Limited access for regular employees",
    permissions: {
      dashboard_view: true,
      
      // Expense submission
      expenses_create: true,
      expenses_view: true,
      
      // Time tracking
      timeTracking_create: true,
      timeTracking_view: true,
      
      // Employee portal
      employeePortal_view: true,
      
      // Leave management
      leaveManagement_create: true,
      leaveManagement_view: true,
    }
  }
};

// Helper to create role from preset
export function getRolePreset(presetName: keyof typeof ROLE_PRESETS) {
  return ROLE_PRESETS[presetName];
}

// Get all preset names
export function getRolePresetNames() {
  return Object.keys(ROLE_PRESETS);
}
