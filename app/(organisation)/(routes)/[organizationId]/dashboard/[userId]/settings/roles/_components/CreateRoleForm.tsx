"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useParams, usePathname, useRouter } from "next/navigation"
import {
  Shield,
  Search,
  Save,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Users,
  BookOpen,
  FileText,
  CreditCard,
  Settings,
  Briefcase,
  Loader2,
  Crown,
  Lock,
  HandCoins,
  Activity,
  BarChart3,
  Package,
  FolderKanban,
  UserCircle,
  TrendingUp,
  Landmark,
  Bot,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createRole, updateRole } from "@/lib/actions/role.action"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Define the permission schema with Zod matching role.model.ts
const RoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  displayName: z.string().min(1, "Display name is required"),
  description: z.string().min(1, "Description is required"),
  permissions: z.object({
    dashboard_view: z.boolean().optional(),
    banking_view: z.boolean().optional(),
    bankAccounts_create: z.boolean().optional(),
    bankAccounts_view: z.boolean().optional(),
    bankAccounts_update: z.boolean().optional(),
    bankAccounts_delete: z.boolean().optional(),
    transactions_create: z.boolean().optional(),
    transactions_view: z.boolean().optional(),
    transactions_update: z.boolean().optional(),
    transactions_delete: z.boolean().optional(),
    reconciliation_create: z.boolean().optional(),
    reconciliation_view: z.boolean().optional(),
    reconciliation_update: z.boolean().optional(),
    reconciliation_delete: z.boolean().optional(),
    bankFeeds_create: z.boolean().optional(),
    bankFeeds_view: z.boolean().optional(),
    bankFeeds_update: z.boolean().optional(),
    bankFeeds_delete: z.boolean().optional(),
    sales_view: z.boolean().optional(),
    invoices_create: z.boolean().optional(),
    invoices_view: z.boolean().optional(),
    invoices_update: z.boolean().optional(),
    invoices_delete: z.boolean().optional(),
    recurringInvoices_create: z.boolean().optional(),
    recurringInvoices_view: z.boolean().optional(),
    recurringInvoices_update: z.boolean().optional(),
    recurringInvoices_delete: z.boolean().optional(),
    customers_create: z.boolean().optional(),
    customers_view: z.boolean().optional(),
    customers_update: z.boolean().optional(),
    customers_delete: z.boolean().optional(),
    estimates_create: z.boolean().optional(),
    estimates_view: z.boolean().optional(),
    estimates_update: z.boolean().optional(),
    estimates_delete: z.boolean().optional(),
    paymentsReceived_create: z.boolean().optional(),
    paymentsReceived_view: z.boolean().optional(),
    paymentsReceived_update: z.boolean().optional(),
    paymentsReceived_delete: z.boolean().optional(),
    salesReceipts_create: z.boolean().optional(),
    salesReceipts_view: z.boolean().optional(),
    salesReceipts_update: z.boolean().optional(),
    salesReceipts_delete: z.boolean().optional(),
    expenses_view: z.boolean().optional(),
    expenses_create: z.boolean().optional(),
    expenses_update: z.boolean().optional(),
    expenses_delete: z.boolean().optional(),
    recurringExpenses_create: z.boolean().optional(),
    recurringExpenses_view: z.boolean().optional(),
    recurringExpenses_update: z.boolean().optional(),
    recurringExpenses_delete: z.boolean().optional(),
    bills_create: z.boolean().optional(),
    bills_view: z.boolean().optional(),
    bills_update: z.boolean().optional(),
    bills_delete: z.boolean().optional(),
    vendors_create: z.boolean().optional(),
    vendors_view: z.boolean().optional(),
    vendors_update: z.boolean().optional(),
    vendors_delete: z.boolean().optional(),
    purchaseOrders_create: z.boolean().optional(),
    purchaseOrders_view: z.boolean().optional(),
    purchaseOrders_update: z.boolean().optional(),
    purchaseOrders_delete: z.boolean().optional(),
    expenseCategories_create: z.boolean().optional(),
    expenseCategories_view: z.boolean().optional(),
    expenseCategories_update: z.boolean().optional(),
    expenseCategories_delete: z.boolean().optional(),
    payroll_view: z.boolean().optional(),
    employees_create: z.boolean().optional(),
    employees_view: z.boolean().optional(),
    employees_update: z.boolean().optional(),
    employees_delete: z.boolean().optional(),
    runPayroll_create: z.boolean().optional(),
    runPayroll_view: z.boolean().optional(),
    runPayroll_update: z.boolean().optional(),
    runPayroll_delete: z.boolean().optional(),
    payrollHistory_view: z.boolean().optional(),
    timeTracking_create: z.boolean().optional(),
    timeTracking_view: z.boolean().optional(),
    timeTracking_update: z.boolean().optional(),
    timeTracking_delete: z.boolean().optional(),
    leaveManagement_create: z.boolean().optional(),
    leaveManagement_view: z.boolean().optional(),
    leaveManagement_update: z.boolean().optional(),
    leaveManagement_delete: z.boolean().optional(),
    deductions_create: z.boolean().optional(),
    deductions_view: z.boolean().optional(),
    deductions_update: z.boolean().optional(),
    deductions_delete: z.boolean().optional(),
    accounting_view: z.boolean().optional(),
    chartOfAccounts_create: z.boolean().optional(),
    chartOfAccounts_view: z.boolean().optional(),
    chartOfAccounts_update: z.boolean().optional(),
    chartOfAccounts_delete: z.boolean().optional(),
    journalEntries_create: z.boolean().optional(),
    journalEntries_view: z.boolean().optional(),
    journalEntries_update: z.boolean().optional(),
    journalEntries_delete: z.boolean().optional(),
    generalLedger_view: z.boolean().optional(),
    tax_view: z.boolean().optional(),
    taxSettings_create: z.boolean().optional(),
    taxSettings_view: z.boolean().optional(),
    taxSettings_update: z.boolean().optional(),
    taxSettings_delete: z.boolean().optional(),
    salesTax_create: z.boolean().optional(),
    salesTax_view: z.boolean().optional(),
    salesTax_update: z.boolean().optional(),
    salesTax_delete: z.boolean().optional(),
    taxReports_view: z.boolean().optional(),
    form1099_create: z.boolean().optional(),
    form1099_view: z.boolean().optional(),
    form1099_update: z.boolean().optional(),
    form1099_delete: z.boolean().optional(),
    formW2_create: z.boolean().optional(),
    formW2_view: z.boolean().optional(),
    formW2_update: z.boolean().optional(),
    formW2_delete: z.boolean().optional(),
    products_view: z.boolean().optional(),
    products_create: z.boolean().optional(),
    products_update: z.boolean().optional(),
    products_delete: z.boolean().optional(),
    productCategories_create: z.boolean().optional(),
    productCategories_view: z.boolean().optional(),
    productCategories_update: z.boolean().optional(),
    productCategories_delete: z.boolean().optional(),
    inventory_create: z.boolean().optional(),
    inventory_view: z.boolean().optional(),
    inventory_update: z.boolean().optional(),
    inventory_delete: z.boolean().optional(),
    stockAdjustments_create: z.boolean().optional(),
    stockAdjustments_view: z.boolean().optional(),
    stockAdjustments_update: z.boolean().optional(),
    stockAdjustments_delete: z.boolean().optional(),
    reports_view: z.boolean().optional(),
    profitLoss_view: z.boolean().optional(),
    balanceSheet_view: z.boolean().optional(),
    cashFlow_view: z.boolean().optional(),
    arAging_view: z.boolean().optional(),
    apAging_view: z.boolean().optional(),
    trialBalance_view: z.boolean().optional(),
    generalLedgerReport_view: z.boolean().optional(),
    taxSummary_view: z.boolean().optional(),
    settings_view: z.boolean().optional(),
    companySettings_view: z.boolean().optional(),
    companySettings_update: z.boolean().optional(),
    userManagement_create: z.boolean().optional(),
    userManagement_view: z.boolean().optional(),
    userManagement_update: z.boolean().optional(),
    userManagement_delete: z.boolean().optional(),
    paymentMethods_create: z.boolean().optional(),
    paymentMethods_view: z.boolean().optional(),
    paymentMethods_update: z.boolean().optional(),
    paymentMethods_delete: z.boolean().optional(),
    emailTemplates_create: z.boolean().optional(),
    emailTemplates_view: z.boolean().optional(),
    emailTemplates_update: z.boolean().optional(),
    emailTemplates_delete: z.boolean().optional(),
    integrations_create: z.boolean().optional(),
    integrations_view: z.boolean().optional(),
    integrations_update: z.boolean().optional(),
    integrations_delete: z.boolean().optional(),
    auditLogs_view: z.boolean().optional(),
    // Banking Enhancements
    bankTransfers_create: z.boolean().optional(),
    bankTransfers_view: z.boolean().optional(),
    bankRules_create: z.boolean().optional(),
    bankRules_view: z.boolean().optional(),
    bankRules_update: z.boolean().optional(),
    bankRules_delete: z.boolean().optional(),
    cashForecast_view: z.boolean().optional(),
    // Sales Enhancements
    creditNotes_create: z.boolean().optional(),
    creditNotes_view: z.boolean().optional(),
    creditNotes_update: z.boolean().optional(),
    creditNotes_delete: z.boolean().optional(),
    customerPortal_view: z.boolean().optional(),
    paymentReminders_create: z.boolean().optional(),
    paymentReminders_view: z.boolean().optional(),
    // Expenses Enhancements
    expenseApprovals_create: z.boolean().optional(),
    expenseApprovals_view: z.boolean().optional(),
    expenseApprovals_update: z.boolean().optional(),
    vendorPortal_view: z.boolean().optional(),
    // Payroll Enhancements
    benefits_create: z.boolean().optional(),
    benefits_view: z.boolean().optional(),
    benefits_update: z.boolean().optional(),
    benefits_delete: z.boolean().optional(),
    employeePortal_view: z.boolean().optional(),
    loans_create: z.boolean().optional(),
    loans_view: z.boolean().optional(),
    loans_update: z.boolean().optional(),
    loans_delete: z.boolean().optional(),
    // Accounting Enhancements
    periodClose_create: z.boolean().optional(),
    periodClose_view: z.boolean().optional(),
    multiEntity_view: z.boolean().optional(),
    // Products Enhancements
    warehouses_create: z.boolean().optional(),
    warehouses_view: z.boolean().optional(),
    warehouses_update: z.boolean().optional(),
    warehouses_delete: z.boolean().optional(),
    stockTransfers_create: z.boolean().optional(),
    stockTransfers_view: z.boolean().optional(),
    stockTransfers_update: z.boolean().optional(),
    reorderAlerts_view: z.boolean().optional(),
    batchExpiry_view: z.boolean().optional(),
    // Projects Module
    projects_view: z.boolean().optional(),
    projects_create: z.boolean().optional(),
    projects_update: z.boolean().optional(),
    projects_delete: z.boolean().optional(),
    projectBudgets_view: z.boolean().optional(),
    projectTime_view: z.boolean().optional(),
    projectProfitability_view: z.boolean().optional(),
    // CRM Module
    crm_view: z.boolean().optional(),
    leads_create: z.boolean().optional(),
    leads_view: z.boolean().optional(),
    leads_update: z.boolean().optional(),
    leads_delete: z.boolean().optional(),
    opportunities_create: z.boolean().optional(),
    opportunities_view: z.boolean().optional(),
    opportunities_update: z.boolean().optional(),
    opportunities_delete: z.boolean().optional(),
    contacts_create: z.boolean().optional(),
    contacts_view: z.boolean().optional(),
    contacts_update: z.boolean().optional(),
    contacts_delete: z.boolean().optional(),
    // Budgeting Module
    budgeting_view: z.boolean().optional(),
    budgets_create: z.boolean().optional(),
    budgets_view: z.boolean().optional(),
    budgets_update: z.boolean().optional(),
    budgets_delete: z.boolean().optional(),
    forecasting_view: z.boolean().optional(),
    // Fixed Assets Module
    assets_view: z.boolean().optional(),
    assets_create: z.boolean().optional(),
    assets_update: z.boolean().optional(),
    assets_delete: z.boolean().optional(),
    depreciation_view: z.boolean().optional(),
    assetCategories_view: z.boolean().optional(),
    // AI Module
    ai_view: z.boolean().optional(),
  }),
})

// Role presets for PayFlow
const rolePresets = {
  accountant: {
    label: "Accountant",
    description: "Full accounting and financial access",
    permissions: {
      dashboard_view: true,
      accounting_view: true,
      chartOfAccounts_view: true,
      chartOfAccounts_create: true,
      chartOfAccounts_update: true,
      journalEntries_view: true,
      journalEntries_create: true,
      journalEntries_update: true,
      generalLedger_view: true,
      reports_view: true,
      profitLoss_view: true,
      balanceSheet_view: true,
      cashFlow_view: true,
      trialBalance_view: true,
      banking_view: true,
      bankAccounts_view: true,
      transactions_view: true,
      reconciliation_view: true,
      reconciliation_create: true,
      tax_view: true,
      taxReports_view: true,
    },
  },
  bookkeeper: {
    label: "Bookkeeper",
    description: "Day-to-day bookkeeping operations",
    permissions: {
      dashboard_view: true,
      banking_view: true,
      bankAccounts_view: true,
      transactions_create: true,
      transactions_view: true,
      transactions_update: true,
      reconciliation_view: true,
      expenses_view: true,
      expenses_create: true,
      expenses_update: true,
      bills_view: true,
      bills_create: true,
      bills_update: true,
      vendors_view: true,
      vendors_create: true,
      sales_view: true,
      invoices_view: true,
      invoices_create: true,
      customers_view: true,
      reports_view: true,
    },
  },
  payrollManager: {
    label: "Payroll Manager",
    description: "Manage payroll and employee compensation",
    permissions: {
      dashboard_view: true,
      payroll_view: true,
      employees_view: true,
      employees_create: true,
      employees_update: true,
      runPayroll_create: true,
      runPayroll_view: true,
      runPayroll_update: true,
      payrollHistory_view: true,
      timeTracking_view: true,
      timeTracking_create: true,
      timeTracking_update: true,
      leaveManagement_view: true,
      leaveManagement_create: true,
      leaveManagement_update: true,
      deductions_view: true,
      deductions_create: true,
      deductions_update: true,
      reports_view: true,
    },
  },
  salesManager: {
    label: "Sales Manager",
    description: "Manage sales, invoices, and customers",
    permissions: {
      dashboard_view: true,
      sales_view: true,
      invoices_create: true,
      invoices_view: true,
      invoices_update: true,
      invoices_delete: true,
      recurringInvoices_create: true,
      recurringInvoices_view: true,
      recurringInvoices_update: true,
      customers_create: true,
      customers_view: true,
      customers_update: true,
      customers_delete: true,
      estimates_create: true,
      estimates_view: true,
      estimates_update: true,
      paymentsReceived_create: true,
      paymentsReceived_view: true,
      salesReceipts_create: true,
      salesReceipts_view: true,
      products_view: true,
      products_create: true,
      reports_view: true,
      arAging_view: true,
    },
  },
  expenseManager: {
    label: "Expense Manager",
    description: "Manage expenses, bills, and vendors",
    permissions: {
      dashboard_view: true,
      expenses_view: true,
      expenses_create: true,
      expenses_update: true,
      expenses_delete: true,
      recurringExpenses_view: true,
      recurringExpenses_create: true,
      bills_create: true,
      bills_view: true,
      bills_update: true,
      bills_delete: true,
      vendors_create: true,
      vendors_view: true,
      vendors_update: true,
      vendors_delete: true,
      purchaseOrders_create: true,
      purchaseOrders_view: true,
      purchaseOrders_update: true,
      expenseCategories_view: true,
      expenseCategories_create: true,
      reports_view: true,
      apAging_view: true,
    },
  },
  viewer: {
    label: "Viewer",
    description: "Read-only access to reports and data",
    permissions: {
      dashboard_view: true,
      banking_view: true,
      bankAccounts_view: true,
      transactions_view: true,
      sales_view: true,
      invoices_view: true,
      customers_view: true,
      expenses_view: true,
      bills_view: true,
      vendors_view: true,
      payroll_view: true,
      employees_view: true,
      payrollHistory_view: true,
      accounting_view: true,
      chartOfAccounts_view: true,
      journalEntries_view: true,
      reports_view: true,
      profitLoss_view: true,
      balanceSheet_view: true,
      cashFlow_view: true,
    },
  },
  administrator: {
    label: "Administrator",
    description: "Full system access with all permissions",
    permissions: {
      dashboard_view: true,
      banking_view: true,
      bankAccounts_create: true,
      bankAccounts_view: true,
      bankAccounts_update: true,
      bankAccounts_delete: true,
      transactions_create: true,
      transactions_view: true,
      transactions_update: true,
      transactions_delete: true,
      reconciliation_create: true,
      reconciliation_view: true,
      reconciliation_update: true,
      reconciliation_delete: true,
      bankFeeds_create: true,
      bankFeeds_view: true,
      bankFeeds_update: true,
      bankFeeds_delete: true,
      sales_view: true,
      invoices_create: true,
      invoices_view: true,
      invoices_update: true,
      invoices_delete: true,
      recurringInvoices_create: true,
      recurringInvoices_view: true,
      recurringInvoices_update: true,
      recurringInvoices_delete: true,
      customers_create: true,
      customers_view: true,
      customers_update: true,
      customers_delete: true,
      estimates_create: true,
      estimates_view: true,
      estimates_update: true,
      estimates_delete: true,
      paymentsReceived_create: true,
      paymentsReceived_view: true,
      paymentsReceived_update: true,
      paymentsReceived_delete: true,
      salesReceipts_create: true,
      salesReceipts_view: true,
      salesReceipts_update: true,
      salesReceipts_delete: true,
      expenses_view: true,
      expenses_create: true,
      expenses_update: true,
      expenses_delete: true,
      recurringExpenses_create: true,
      recurringExpenses_view: true,
      recurringExpenses_update: true,
      recurringExpenses_delete: true,
      bills_create: true,
      bills_view: true,
      bills_update: true,
      bills_delete: true,
      vendors_create: true,
      vendors_view: true,
      vendors_update: true,
      vendors_delete: true,
      purchaseOrders_create: true,
      purchaseOrders_view: true,
      purchaseOrders_update: true,
      purchaseOrders_delete: true,
      expenseCategories_create: true,
      expenseCategories_view: true,
      expenseCategories_update: true,
      expenseCategories_delete: true,
      payroll_view: true,
      employees_create: true,
      employees_view: true,
      employees_update: true,
      employees_delete: true,
      runPayroll_create: true,
      runPayroll_view: true,
      runPayroll_update: true,
      runPayroll_delete: true,
      payrollHistory_view: true,
      timeTracking_create: true,
      timeTracking_view: true,
      timeTracking_update: true,
      timeTracking_delete: true,
      leaveManagement_create: true,
      leaveManagement_view: true,
      leaveManagement_update: true,
      leaveManagement_delete: true,
      deductions_create: true,
      deductions_view: true,
      deductions_update: true,
      deductions_delete: true,
      accounting_view: true,
      chartOfAccounts_create: true,
      chartOfAccounts_view: true,
      chartOfAccounts_update: true,
      chartOfAccounts_delete: true,
      journalEntries_create: true,
      journalEntries_view: true,
      journalEntries_update: true,
      journalEntries_delete: true,
      generalLedger_view: true,
      tax_view: true,
      taxSettings_create: true,
      taxSettings_view: true,
      taxSettings_update: true,
      taxSettings_delete: true,
      salesTax_create: true,
      salesTax_view: true,
      salesTax_update: true,
      salesTax_delete: true,
      taxReports_view: true,
      form1099_create: true,
      form1099_view: true,
      form1099_update: true,
      form1099_delete: true,
      formW2_create: true,
      formW2_view: true,
      formW2_update: true,
      formW2_delete: true,
      products_create: true,
      products_view: true,
      products_update: true,
      products_delete: true,
      reports_view: true,
      profitLoss_view: true,
      balanceSheet_view: true,
      cashFlow_view: true,
      arAging_view: true,
      apAging_view: true,
      trialBalance_view: true,
      generalLedgerReport_view: true,
      taxSummary_view: true,
      settings_view: true,
      companySettings_view: true,
      companySettings_update: true,
      userManagement_create: true,
      userManagement_view: true,
      userManagement_update: true,
      userManagement_delete: true,
      paymentMethods_create: true,
      paymentMethods_view: true,
      paymentMethods_update: true,
      paymentMethods_delete: true,
      emailTemplates_create: true,
      emailTemplates_view: true,
      emailTemplates_update: true,
      emailTemplates_delete: true,
      integrations_create: true,
      integrations_view: true,
      integrations_update: true,
      integrations_delete: true,
      auditLogs_view: true,
    },
  },
}

// Permission category definitions for PayFlow
const permissionCategories = {
  dashboard: {
    title: "Dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
    description: "Dashboard access and overview",
    module: "dashboard",
    permissions: ["dashboard_view"],
  },
  banking: {
    title: "Banking",
    icon: <CreditCard className="h-5 w-5" />,
    description: "Bank accounts and transactions",
    module: "banking",
    permissions: [
      "banking_view",
      "bankAccounts_create",
      "bankAccounts_view",
      "bankAccounts_update",
      "bankAccounts_delete",
      "transactions_create",
      "transactions_view",
      "transactions_update",
      "transactions_delete",
      "reconciliation_create",
      "reconciliation_view",
      "reconciliation_update",
      "reconciliation_delete",
      "bankFeeds_create",
      "bankFeeds_view",
      "bankFeeds_update",
      "bankFeeds_delete",
      "bankTransfers_create",
      "bankTransfers_view",
      "bankRules_create",
      "bankRules_view",
      "bankRules_update",
      "bankRules_delete",
      "cashForecast_view",
    ],
  },
  sales: {
    title: "Sales & Invoicing",
    icon: <FileText className="h-5 w-5" />,
    description: "Invoices, customers, and sales",
    module: "sales",
    permissions: [
      "sales_view",
      "invoices_create",
      "invoices_view",
      "invoices_update",
      "invoices_delete",
      "recurringInvoices_create",
      "recurringInvoices_view",
      "recurringInvoices_update",
      "recurringInvoices_delete",
      "customers_create",
      "customers_view",
      "customers_update",
      "customers_delete",
      "estimates_create",
      "estimates_view",
      "estimates_update",
      "estimates_delete",
      "paymentsReceived_create",
      "paymentsReceived_view",
      "paymentsReceived_update",
      "paymentsReceived_delete",
      "salesReceipts_create",
      "salesReceipts_view",
      "salesReceipts_update",
      "salesReceipts_delete",
      "creditNotes_create",
      "creditNotes_view",
      "creditNotes_update",
      "creditNotes_delete",
      "customerPortal_view",
      "paymentReminders_create",
      "paymentReminders_view",
    ],
  },
  expenses: {
    title: "Expenses & Bills",
    icon: <HandCoins className="h-5 w-5" />,
    description: "Expenses, bills, and vendors",
    module: "expenses",
    permissions: [
      "expenses_view",
      "expenses_create",
      "expenses_update",
      "expenses_delete",
      "recurringExpenses_create",
      "recurringExpenses_view",
      "recurringExpenses_update",
      "recurringExpenses_delete",
      "bills_create",
      "bills_view",
      "bills_update",
      "bills_delete",
      "vendors_create",
      "vendors_view",
      "vendors_update",
      "vendors_delete",
      "purchaseOrders_create",
      "purchaseOrders_view",
      "purchaseOrders_update",
      "purchaseOrders_delete",
      "expenseCategories_create",
      "expenseCategories_view",
      "expenseCategories_update",
      "expenseCategories_delete",
      "expenseApprovals_create",
      "expenseApprovals_view",
      "expenseApprovals_update",
      "vendorPortal_view",
    ],
  },
  payroll: {
    title: "Payroll",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Employee payroll and time tracking",
    module: "payroll",
    permissions: [
      "payroll_view",
      "employees_create",
      "employees_view",
      "employees_update",
      "employees_delete",
      "runPayroll_create",
      "runPayroll_view",
      "runPayroll_update",
      "runPayroll_delete",
      "payrollHistory_view",
      "timeTracking_create",
      "timeTracking_view",
      "timeTracking_update",
      "timeTracking_delete",
      "leaveManagement_create",
      "leaveManagement_view",
      "leaveManagement_update",
      "leaveManagement_delete",
      "deductions_create",
      "deductions_view",
      "deductions_update",
      "deductions_delete",
      "benefits_create",
      "benefits_view",
      "benefits_update",
      "benefits_delete",
      "employeePortal_view",
      "loans_create",
      "loans_view",
      "loans_update",
      "loans_delete",
    ],
  },
  accounting: {
    title: "Accounting",
    icon: <BookOpen className="h-5 w-5" />,
    description: "Chart of accounts and journal entries",
    module: "accounting",
    permissions: [
      "accounting_view",
      "chartOfAccounts_create",
      "chartOfAccounts_view",
      "chartOfAccounts_update",
      "chartOfAccounts_delete",
      "journalEntries_create",
      "journalEntries_view",
      "journalEntries_update",
      "journalEntries_delete",
      "generalLedger_view",
      "periodClose_create",
      "periodClose_view",
      "multiEntity_view",
    ],
  },
  tax: {
    title: "Tax Management",
    icon: <FileText className="h-5 w-5" />,
    description: "Tax settings and compliance",
    module: "tax",
    permissions: [
      "tax_view",
      "taxSettings_create",
      "taxSettings_view",
      "taxSettings_update",
      "taxSettings_delete",
      "salesTax_create",
      "salesTax_view",
      "salesTax_update",
      "salesTax_delete",
      "taxReports_view",
      "form1099_create",
      "form1099_view",
      "form1099_update",
      "form1099_delete",
      "formW2_create",
      "formW2_view",
      "formW2_update",
      "formW2_delete",
    ],
  },
  products: {
    title: "Products & Services",
    icon: <BookOpen className="h-5 w-5" />,
    description: "Product catalog and inventory",
    module: "products",
    permissions: [
      "products_view",
      "products_create",
      "products_update",
      "products_delete",
      "productCategories_create",
      "productCategories_view",
      "productCategories_update",
      "productCategories_delete",
      "inventory_create",
      "inventory_view",
      "inventory_update",
      "inventory_delete",
      "stockAdjustments_create",
      "stockAdjustments_view",
      "stockAdjustments_update",
      "stockAdjustments_delete",
      "warehouses_create",
      "warehouses_view",
      "warehouses_update",
      "warehouses_delete",
      "stockTransfers_create",
      "stockTransfers_view",
      "stockTransfers_update",
      "reorderAlerts_view",
      "batchExpiry_view",
    ],
  },
  projects: {
    title: "Projects",
    icon: <FolderKanban className="h-5 w-5" />,
    description: "Project management and tracking",
    module: "projects",
    permissions: [
      "projects_view",
      "projects_create",
      "projects_update",
      "projects_delete",
      "projectBudgets_view",
      "projectTime_view",
      "projectProfitability_view",
    ],
  },
  crm: {
    title: "CRM",
    icon: <UserCircle className="h-5 w-5" />,
    description: "Customer relationship management",
    module: "crm",
    permissions: [
      "crm_view",
      "leads_create",
      "leads_view",
      "leads_update",
      "leads_delete",
      "opportunities_create",
      "opportunities_view",
      "opportunities_update",
      "opportunities_delete",
      "contacts_create",
      "contacts_view",
      "contacts_update",
      "contacts_delete",
    ],
  },
  budgeting: {
    title: "Budgeting",
    icon: <TrendingUp className="h-5 w-5" />,
    description: "Budget planning and forecasting",
    module: "budgeting",
    permissions: [
      "budgeting_view",
      "budgets_create",
      "budgets_view",
      "budgets_update",
      "budgets_delete",
      "forecasting_view",
    ],
  },
  assets: {
    title: "Fixed Assets",
    icon: <Landmark className="h-5 w-5" />,
    description: "Fixed asset management and depreciation",
    module: "assets",
    permissions: [
      "assets_view",
      "assets_create",
      "assets_update",
      "assets_delete",
      "depreciation_view",
      "assetCategories_view",
    ],
  },
  ai: {
    title: "AI Assistant",
    icon: <Bot className="h-5 w-5" />,
    description: "AI-powered insights and automation",
    module: "ai",
    permissions: ["ai_view"],
  },
  reports: {
    title: "Reports",
    icon: <Activity className="h-5 w-5" />,
    description: "Financial reports and analytics",
    module: "reports",
    permissions: [
      "reports_view",
      "profitLoss_view",
      "balanceSheet_view",
      "cashFlow_view",
      "arAging_view",
      "apAging_view",
      "trialBalance_view",
      "generalLedgerReport_view",
      "taxSummary_view",
    ],
  },
  settings: {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    description: "System settings and configuration",
    module: "settings",
    permissions: [
      "settings_view",
      "companySettings_view",
      "companySettings_update",
      "userManagement_create",
      "userManagement_view",
      "userManagement_update",
      "userManagement_delete",
      "paymentMethods_create",
      "paymentMethods_view",
      "paymentMethods_update",
      "paymentMethods_delete",
      "emailTemplates_create",
      "emailTemplates_view",
      "emailTemplates_update",
      "emailTemplates_delete",
      "integrations_create",
      "integrations_view",
      "integrations_update",
      "integrations_delete",
      "auditLogs_view",
    ],
  },
}

// Permission descriptions for PayFlow
const permissionDescriptions: Record<string, string> = {
  dashboard_view: "Access main dashboard and overview",
  banking_view: "View banking module",
  bankAccounts_create: "Create new bank accounts",
  bankAccounts_view: "View bank account details",
  transactions_view: "View bank transactions",
  reconciliation_view: "View bank reconciliations",
  sales_view: "Access sales and invoicing module",
  invoices_create: "Create new invoices",
  invoices_view: "View invoices",
  customers_view: "View customer records",
  expenses_view: "Access expenses module",
  expenses_create: "Create expense records",
  bills_view: "View bills and payables",
  vendors_view: "View vendor records",
  payroll_view: "Access payroll module",
  employees_view: "View employee records",
  runPayroll_create: "Process payroll runs",
  accounting_view: "Access accounting module",
  chartOfAccounts_view: "View chart of accounts",
  journalEntries_view: "View journal entries",
  tax_view: "Access tax management",
  reports_view: "Access financial reports",
  settings_view: "Access system settings",
  userManagement_view: "View user management",
  auditLogs_view: "View audit logs",
}

// Function to get a human-readable name from a camelCase permission key
const getReadableName = (key: string) => {
  if (key === "hr") return "HR"
  if (key === "hrManagement") return "HR Management"
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
}

interface IRole {
  _id?: string
  name?: string
  displayName?: string
  description?: string
  permissions?: Record<string, boolean>
}

const CreateRoleForm = ({
  type,
  initialData,
  enabledModules = {},
}: { type: "create" | "update"; initialData?: IRole; enabledModules?: Record<string, boolean> }) => {
  const path = usePathname()
  const router = useRouter()
  const params = useParams()
  const { organizationId, userId } = params
  const roleId = initialData?._id as string

  const [searchTerm, setSearchTerm] = useState("")
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Create default values for the form
  const defaultValues = {
    name: initialData?.name || "",
    displayName: initialData?.displayName || "",
    description: initialData?.description || "",
    permissions:
      initialData?.permissions ||
      Object.fromEntries(Object.keys(RoleSchema.shape.permissions.shape).map((key) => [key, false])),
  }

  // Initialize form with existing permissions or defaults
  const form = useForm<z.infer<typeof RoleSchema>>({
    resolver: zodResolver(RoleSchema),
    defaultValues,
    mode: "onChange", // This helps with validation
  })

  const submit = initialData ? "Update" : "Create"
  const submitting = initialData ? "Updating..." : "Creating..."

  // Function to apply a role preset
  const applyRolePreset = (presetKey: string) => {
    if (rolePresets[presetKey as keyof typeof rolePresets]) {
      const preset = rolePresets[presetKey as keyof typeof rolePresets]

      // Get current form values
      const currentValues = form.getValues()

      // Update only the permissions, keeping other fields intact
      form.reset({
        ...currentValues,
        permissions: preset.permissions as Record<string, boolean>,
      })
      setSelectedPreset(presetKey)
      toast(`Applied ${preset.label} preset`, {
        description: preset.description,
      })
    }
  }

  // Map category to module key
  const getModuleKeyForCategory = (category: string): string | null => {
    const categoryData = permissionCategories[category as keyof typeof permissionCategories]
    return categoryData?.module || null
  }

  // Function to toggle all permissions in a category
  const toggleCategoryPermissions = (category: string, value: boolean) => {
    const categoryData = permissionCategories[category as keyof typeof permissionCategories]
    // Check if category module is enabled
    const moduleKey = getModuleKeyForCategory(category)
    if (moduleKey && !enabledModules[moduleKey] && value) {
      toast.error("Module Not Enabled", {
        description: `${categoryData.title} module is not enabled for your organization.`,
      })
      return
    }

    const updatedValues = { ...form.getValues() }
    // Get all permissions in this category
    const permissionsInCategory = categoryData.permissions

    // Update all permissions in the category
    permissionsInCategory.forEach((permission) => {
      updatedValues.permissions[permission as keyof typeof updatedValues.permissions] = value
    })
    form.reset(updatedValues)
  }

  // Function to check if a permission matches the search term
  const matchesSearch = (permission: string) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    const permissionName = getReadableName(permission).toLowerCase()
    const description = permissionDescriptions[permission as keyof typeof permissionDescriptions]?.toLowerCase()
    return permissionName.includes(searchLower) || (description && description.includes(searchLower))
  }

  // Function to count enabled permissions in a category
  const countEnabledPermissions = (category: string) => {
    const permissions = permissionCategories[category as keyof typeof permissionCategories].permissions
    const values = form.getValues().permissions
    return permissions.filter((p) => values[p as keyof typeof values]).length
  }

  // Function to get total permissions in a category
  const getTotalPermissions = (category: string) => {
    return permissionCategories[category as keyof typeof permissionCategories].permissions.length
  }

  // Toggle expanding/collapsing all sections
  const toggleAllSections = () => {
    if (expandedSections.length === Object.keys(permissionCategories).length) {
      setExpandedSections([])
    } else {
      setExpandedSections(Object.keys(permissionCategories))
    }
  }

  // Handle individual permission toggle with module check
  const handlePermissionToggle = (permission: string, value: boolean) => {
    // Find which category this permission belongs to
    const categoryEntry = Object.entries(permissionCategories).find(([_, categoryData]) =>
      categoryData.permissions.includes(permission),
    )

    if (categoryEntry) {
      const moduleKey = getModuleKeyForCategory(categoryEntry[0])
      if (moduleKey && !enabledModules[moduleKey] && value) {
        toast.error("Module Not Enabled", {
          description: `This feature requires a module that is not enabled.`,
        })
        return false
      }
    }
    return true
  }

  // Enhanced form submission with better error handling
  async function onSubmit(values: z.infer<typeof RoleSchema>) {
    console.log("Form submission started", { values, type })
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      // Validate the form data
      const validatedData = RoleSchema.parse(values)
      console.log("Form validation passed", validatedData)

      // Ensure all permissions have boolean values (convert undefined to false)
      const allPermissionKeys = Object.keys(RoleSchema.shape.permissions.shape)
      const processedPermissions = allPermissionKeys.reduce((acc, key) => {
        acc[key] = Boolean(validatedData.permissions[key as keyof typeof validatedData.permissions])
        return acc
      }, {} as Record<string, boolean>)

      const processedData = {
        ...validatedData,
        permissions: processedPermissions
      } as { name: string; displayName: string; description: string; permissions: Record<string, boolean> }

      let result
      if (type === "create") {
        console.log("Calling createRole...")
        result = await createRole(processedData, path)
        console.log("createRole result:", result)
      } else {
        console.log("Calling updateRole...", { roleId })
        result = await updateRole(roleId, processedData, path)
        console.log("updateRole result:", result)
      }

      // Check if the action was successful
      if (result && result.error) {
        throw new Error(result.error)
      }

      form.reset()
      toast.success(`Role ${type === "create" ? "Created" : "Updated"} successfully`, {
        description: `The role has been ${type === "create" ? "created" : "updated"} successfully.`,
      })

      // Navigate back to the role management page
      router.push(`/${organizationId}/dashboard/${userId}/settings/roles`)
    } catch (error) {
      console.error("Form submission error:", error)

      let errorMessage = "Something went wrong"
      let errorDescription = "Please try again later."

      if (error instanceof Error) {
        errorMessage = error.message
        if (error.message.includes("validation")) {
          errorDescription = "Please check your form data and try again."
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          errorDescription = "Network error. Please check your connection and try again."
        } else if (error.message.includes("permission") || error.message.includes("unauthorized")) {
          errorDescription = "You don't have permission to perform this action."
        }
      }

      setSubmitError(errorMessage)
      toast.error(errorMessage, {
        description: errorDescription,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Debug function to log form state
  const debugFormState = () => {
    const formState = form.formState
    const values = form.getValues()
    console.log("Form Debug Info:", {
      isValid: formState.isValid,
      errors: formState.errors,
      values: values,
      isSubmitting: isSubmitting,
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <Form {...form}>
        <form  onSubmit={
            form.handleSubmit(onSubmit)
          } className="space-y-8">
          <Card className="shadow-md border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-t-lg border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {type === "create" ? "Create New Role" : "Update Role"}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      {type === "create"
                        ? "Define a new role with specific permissions"
                        : "Modify existing role permissions"}
                    </CardDescription>
                  </div>
                </div>
                {!enabledModules.dashboard && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <Lock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Limited Modules</span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {/* Debug Section - Remove in production */}
              {/* <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Debug Information</h3>
                  <Button type="button" variant="outline" size="sm" onClick={debugFormState}>
                    Log Form State
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Form Valid: {form.formState.isValid ? "✅" : "❌"}</p>
                  <p>Is Submitting: {isSubmitting ? "✅" : "❌"}</p>
                  <p>Error Count: {Object.keys(form.formState.errors).length}</p>
                  {Object.keys(form.formState.errors).length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer">View Errors</summary>
                      <pre className="mt-2 text-xs bg-red-50 p-2 rounded">
                        {JSON.stringify(form.formState.errors, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div> */}

              {/* Error Alert */}
              {/* {submitError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )} */}

              {/* Role Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Role Name..." {...field} />
                      </FormControl>
                      <FormDescription>Internal name used by the system</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Display Name..." {...field} />
                      </FormControl>
                      <FormDescription>Name shown to users in the interface</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Write a short description..." {...field} />
                      </FormControl>
                      <FormDescription>Brief explanation of this role&apos;s purpose</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Permissions Section */}
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">Role Permissions</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Configure access levels and capabilities for this role
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select onValueChange={applyRolePreset} value={selectedPreset || undefined}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Apply preset" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(rolePresets).map(([key, preset]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <span>{preset.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search permissions..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={toggleAllSections}
                      className="gap-1 bg-transparent"
                    >
                      {expandedSections.length === Object.keys(permissionCategories).length ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Collapse All
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Expand All
                        </>
                      )}
                    </Button>
                    {searchTerm && (
                      <Badge variant="outline" className="gap-1">
                        <Search className="h-3 w-3" />
                        {searchTerm}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                      <span>Enabled</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="inline-block w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                      <span>Disabled</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Crown className="h-3 w-3 text-amber-500" />
                      <span>Pro Only</span>
                    </div>
                  </div>
                </div>

                <Accordion
                  type="multiple"
                  value={expandedSections}
                  onValueChange={setExpandedSections}
                  className="space-y-4"
                >
                  {Object.entries(permissionCategories).map(([category, config]) => {
                    const { title, icon, description, permissions, module } = config
                    const enabledCount = countEnabledPermissions(category)
                    const totalCount = getTotalPermissions(category)
                    const hasMatchingPermissions = permissions.some((permission) => matchesSearch(permission))
                    
                    // Check if module is enabled
                    const isModuleDisabled = module && !enabledModules[module]

                    if (searchTerm && !hasMatchingPermissions) return null

                    return (
                      <AccordionItem
                        key={category}
                        value={category}
                        className={cn(
                          "border rounded-lg overflow-hidden transition-all",
                          isModuleDisabled && "opacity-60 bg-gray-50 dark:bg-gray-900/50",
                        )}
                      >
                        <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "p-1.5 rounded-md transition-colors",
                                  isModuleDisabled ? "bg-gray-100 text-gray-400" : "bg-primary/10 text-primary",
                                )}
                              >
                                {icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-left">{title}</h3>
                                  {isModuleDisabled && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs px-1.5 py-0 h-4 bg-gray-100 text-gray-500"
                                    >
                                      DISABLED
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground text-left">{description}</p>
                                <p className="text-xs text-muted-foreground text-left mt-1">
                                  {enabledCount} of {totalCount} permissions enabled
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mr-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 gap-1"
                                      disabled={isModuleDisabled}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleCategoryPermissions(category, true)
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span className="sr-only md:not-sr-only md:inline-block">Enable All</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {isModuleDisabled
                                        ? "Module not enabled"
                                        : "Enable all permissions in this category"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 gap-1"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleCategoryPermissions(category, false)
                                      }}
                                    >
                                      <XCircle className="h-4 w-4 text-red-500" />
                                      <span className="sr-only md:not-sr-only md:inline-block">Disable All</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Disable all permissions in this category</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3 border-t bg-white dark:bg-gray-950">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {permissions.map((permission) => {
                              if (searchTerm && !matchesSearch(permission)) return null

                              // Explicitly type permission as keyof typeof RoleSchema.shape.permissions.shape
                              type PermissionKey = keyof typeof RoleSchema.shape.permissions.shape
                              const permissionKey = permission as PermissionKey
                              const isModuleDisabled = module && !enabledModules[module]

                              return (
                                <FormField
                                  key={permissionKey} // Use permissionKey as key for stable rendering
                                  control={form.control}
                                  name={`permissions.${permissionKey}`}
                                  render={({ field }) => (
                                    <FormItem
                                      className={cn(
                                        "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 transition-all",
                                        isModuleDisabled && "opacity-50 bg-gray-50 dark:bg-gray-900/50",
                                      )}
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value}
                                          disabled={isModuleDisabled}
                                          onCheckedChange={(checked) => {
                                            if (handlePermissionToggle(permissionKey, !!checked)) {
                                              field.onChange(checked)
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-1 leading-none flex-1">
                                        <div className="flex items-center gap-2">
                                          <FormLabel className="font-medium">
                                            {getReadableName(permissionKey)}
                                          </FormLabel>
                                          {isModuleDisabled && (
                                            <div className="flex items-center gap-1">
                                              <Lock className="h-3 w-3 text-gray-400" />
                                            </div>
                                          )}
                                        </div>
                                        <FormDescription>
                                          {permissionDescriptions[
                                            permissionKey as keyof typeof permissionDescriptions
                                          ] ||
                                            `Control access to ${getReadableName(permission).toLowerCase()} functionality`}
                                        </FormDescription>
                                      </div>
                                    </FormItem>
                                  )}
                                />
                              )
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 p-6 bg-gray-50 dark:bg-gray-900 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Changes to permissions will be logged in the audit trail</span>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/${organizationId}/dashboard/${userId}/settings/roles`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSubmitting ? submitting : submit}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

export default CreateRoleForm