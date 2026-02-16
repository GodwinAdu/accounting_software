import { Schema, model, models, Model } from "mongoose";

interface IRole extends Document {
    organizationId: Schema.Types.ObjectId
    name: string
    displayName: string
    description?: string
    permissions: {
        // Core Access
        dashboard_view?: boolean
        
        // Banking Module
        banking_view?: boolean
        bankAccounts_create?: boolean
        bankAccounts_view?: boolean
        bankAccounts_update?: boolean
        bankAccounts_delete?: boolean
        transactions_create?: boolean
        transactions_view?: boolean
        transactions_update?: boolean
        transactions_delete?: boolean
        reconciliation_create?: boolean
        reconciliation_view?: boolean
        reconciliation_update?: boolean
        reconciliation_delete?: boolean
        bankFeeds_create?: boolean
        bankFeeds_view?: boolean
        bankFeeds_update?: boolean
        bankFeeds_delete?: boolean
        
        // Sales & Invoicing Module
        sales_view?: boolean
        invoices_create?: boolean
        invoices_view?: boolean
        invoices_update?: boolean
        invoices_delete?: boolean
        recurringInvoices_create?: boolean
        recurringInvoices_view?: boolean
        recurringInvoices_update?: boolean
        recurringInvoices_delete?: boolean
        customers_create?: boolean
        customers_view?: boolean
        customers_update?: boolean
        customers_delete?: boolean
        estimates_create?: boolean
        estimates_view?: boolean
        estimates_update?: boolean
        estimates_delete?: boolean
        paymentsReceived_create?: boolean
        paymentsReceived_view?: boolean
        paymentsReceived_update?: boolean
        paymentsReceived_delete?: boolean
        salesReceipts_create?: boolean
        salesReceipts_view?: boolean
        salesReceipts_update?: boolean
        salesReceipts_delete?: boolean
        
        // Expenses & Bills Module
        expenses_view?: boolean
        expenses_create?: boolean
        expenses_update?: boolean
        expenses_delete?: boolean
        recurringExpenses_create?: boolean
        recurringExpenses_view?: boolean
        recurringExpenses_update?: boolean
        recurringExpenses_delete?: boolean
        bills_create?: boolean
        bills_view?: boolean
        bills_update?: boolean
        bills_delete?: boolean
        vendors_create?: boolean
        vendors_view?: boolean
        vendors_update?: boolean
        vendors_delete?: boolean
        purchaseOrders_create?: boolean
        purchaseOrders_view?: boolean
        purchaseOrders_update?: boolean
        purchaseOrders_delete?: boolean
        expenseCategories_create?: boolean
        expenseCategories_view?: boolean
        expenseCategories_update?: boolean
        expenseCategories_delete?: boolean
        
        // Payroll Module
        payroll_view?: boolean
        employees_create?: boolean
        employees_view?: boolean
        employees_update?: boolean
        employees_delete?: boolean
        runPayroll_create?: boolean
        runPayroll_view?: boolean
        runPayroll_update?: boolean
        runPayroll_delete?: boolean
        payrollHistory_view?: boolean
        timeTracking_create?: boolean
        timeTracking_view?: boolean
        timeTracking_update?: boolean
        timeTracking_delete?: boolean
        leaveManagement_create?: boolean
        leaveManagement_view?: boolean
        leaveManagement_update?: boolean
        leaveManagement_delete?: boolean
        deductions_create?: boolean
        deductions_view?: boolean
        deductions_update?: boolean
        deductions_delete?: boolean
        
        // Accounting Module
        accounting_view?: boolean
        chartOfAccounts_create?: boolean
        chartOfAccounts_view?: boolean
        chartOfAccounts_update?: boolean
        chartOfAccounts_delete?: boolean
        journalEntries_create?: boolean
        journalEntries_view?: boolean
        journalEntries_update?: boolean
        journalEntries_delete?: boolean
        generalLedger_view?: boolean
        
        // Tax Management Module
        tax_view?: boolean
        taxSettings_create?: boolean
        taxSettings_view?: boolean
        taxSettings_update?: boolean
        taxSettings_delete?: boolean
        salesTax_create?: boolean
        salesTax_view?: boolean
        salesTax_update?: boolean
        salesTax_delete?: boolean
        taxReports_view?: boolean
        form1099_create?: boolean
        form1099_view?: boolean
        form1099_update?: boolean
        form1099_delete?: boolean
        formW2_create?: boolean
        formW2_view?: boolean
        formW2_update?: boolean
        formW2_delete?: boolean
        
        // Products & Services Module
        products_create?: boolean
        products_view?: boolean
        products_update?: boolean
        products_delete?: boolean
        
        // Reports Module
        reports_view?: boolean
        profitLoss_view?: boolean
        balanceSheet_view?: boolean
        cashFlow_view?: boolean
        arAging_view?: boolean
        apAging_view?: boolean
        trialBalance_view?: boolean
        generalLedgerReport_view?: boolean
        taxSummary_view?: boolean
        
        // Settings Module
        settings_view?: boolean
        companySettings_view?: boolean
        companySettings_update?: boolean
        userManagement_create?: boolean
        userManagement_view?: boolean
        userManagement_update?: boolean
        userManagement_delete?: boolean
        paymentMethods_create?: boolean
        paymentMethods_view?: boolean
        paymentMethods_update?: boolean
        paymentMethods_delete?: boolean
        emailTemplates_create?: boolean
        emailTemplates_view?: boolean
        emailTemplates_update?: boolean
        emailTemplates_delete?: boolean
        integrations_create?: boolean
        integrations_view?: boolean
        integrations_update?: boolean
        integrations_delete?: boolean
        auditLogs_view?: boolean
    }
    createdBy?: Schema.Types.ObjectId | null
    modifiedBy?: Schema.Types.ObjectId | null
    deletedBy?: Schema.Types.ObjectId | null
    mod_flag?: boolean
    del_flag?: boolean
    action_type?: string
}

const RoleSchema: Schema<IRole> = new Schema({
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
    },
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    description: { type: String },
    permissions: {
        // Core Access
        dashboard_view: { type: Boolean, default: false },
        
        // Banking Module
        banking_view: { type: Boolean, default: false },
        bankAccounts_create: { type: Boolean, default: false },
        bankAccounts_view: { type: Boolean, default: false },
        bankAccounts_update: { type: Boolean, default: false },
        bankAccounts_delete: { type: Boolean, default: false },
        transactions_create: { type: Boolean, default: false },
        transactions_view: { type: Boolean, default: false },
        transactions_update: { type: Boolean, default: false },
        transactions_delete: { type: Boolean, default: false },
        reconciliation_create: { type: Boolean, default: false },
        reconciliation_view: { type: Boolean, default: false },
        reconciliation_update: { type: Boolean, default: false },
        reconciliation_delete: { type: Boolean, default: false },
        bankFeeds_create: { type: Boolean, default: false },
        bankFeeds_view: { type: Boolean, default: false },
        bankFeeds_update: { type: Boolean, default: false },
        bankFeeds_delete: { type: Boolean, default: false },
        
        // Sales & Invoicing Module
        sales_view: { type: Boolean, default: false },
        invoices_create: { type: Boolean, default: false },
        invoices_view: { type: Boolean, default: false },
        invoices_update: { type: Boolean, default: false },
        invoices_delete: { type: Boolean, default: false },
        recurringInvoices_create: { type: Boolean, default: false },
        recurringInvoices_view: { type: Boolean, default: false },
        recurringInvoices_update: { type: Boolean, default: false },
        recurringInvoices_delete: { type: Boolean, default: false },
        customers_create: { type: Boolean, default: false },
        customers_view: { type: Boolean, default: false },
        customers_update: { type: Boolean, default: false },
        customers_delete: { type: Boolean, default: false },
        estimates_create: { type: Boolean, default: false },
        estimates_view: { type: Boolean, default: false },
        estimates_update: { type: Boolean, default: false },
        estimates_delete: { type: Boolean, default: false },
        paymentsReceived_create: { type: Boolean, default: false },
        paymentsReceived_view: { type: Boolean, default: false },
        paymentsReceived_update: { type: Boolean, default: false },
        paymentsReceived_delete: { type: Boolean, default: false },
        salesReceipts_create: { type: Boolean, default: false },
        salesReceipts_view: { type: Boolean, default: false },
        salesReceipts_update: { type: Boolean, default: false },
        salesReceipts_delete: { type: Boolean, default: false },
        
        // Expenses & Bills Module
        expenses_view: { type: Boolean, default: false },
        expenses_create: { type: Boolean, default: false },
        expenses_update: { type: Boolean, default: false },
        expenses_delete: { type: Boolean, default: false },
        recurringExpenses_create: { type: Boolean, default: false },
        recurringExpenses_view: { type: Boolean, default: false },
        recurringExpenses_update: { type: Boolean, default: false },
        recurringExpenses_delete: { type: Boolean, default: false },
        bills_create: { type: Boolean, default: false },
        bills_view: { type: Boolean, default: false },
        bills_update: { type: Boolean, default: false },
        bills_delete: { type: Boolean, default: false },
        vendors_create: { type: Boolean, default: false },
        vendors_view: { type: Boolean, default: false },
        vendors_update: { type: Boolean, default: false },
        vendors_delete: { type: Boolean, default: false },
        purchaseOrders_create: { type: Boolean, default: false },
        purchaseOrders_view: { type: Boolean, default: false },
        purchaseOrders_update: { type: Boolean, default: false },
        purchaseOrders_delete: { type: Boolean, default: false },
        expenseCategories_create: { type: Boolean, default: false },
        expenseCategories_view: { type: Boolean, default: false },
        expenseCategories_update: { type: Boolean, default: false },
        expenseCategories_delete: { type: Boolean, default: false },
        
        // Payroll Module
        payroll_view: { type: Boolean, default: false },
        employees_create: { type: Boolean, default: false },
        employees_view: { type: Boolean, default: false },
        employees_update: { type: Boolean, default: false },
        employees_delete: { type: Boolean, default: false },
        runPayroll_create: { type: Boolean, default: false },
        runPayroll_view: { type: Boolean, default: false },
        runPayroll_update: { type: Boolean, default: false },
        runPayroll_delete: { type: Boolean, default: false },
        payrollHistory_view: { type: Boolean, default: false },
        timeTracking_create: { type: Boolean, default: false },
        timeTracking_view: { type: Boolean, default: false },
        timeTracking_update: { type: Boolean, default: false },
        timeTracking_delete: { type: Boolean, default: false },
        leaveManagement_create: { type: Boolean, default: false },
        leaveManagement_view: { type: Boolean, default: false },
        leaveManagement_update: { type: Boolean, default: false },
        leaveManagement_delete: { type: Boolean, default: false },
        deductions_create: { type: Boolean, default: false },
        deductions_view: { type: Boolean, default: false },
        deductions_update: { type: Boolean, default: false },
        deductions_delete: { type: Boolean, default: false },
        
        // Accounting Module
        accounting_view: { type: Boolean, default: false },
        chartOfAccounts_create: { type: Boolean, default: false },
        chartOfAccounts_view: { type: Boolean, default: false },
        chartOfAccounts_update: { type: Boolean, default: false },
        chartOfAccounts_delete: { type: Boolean, default: false },
        journalEntries_create: { type: Boolean, default: false },
        journalEntries_view: { type: Boolean, default: false },
        journalEntries_update: { type: Boolean, default: false },
        journalEntries_delete: { type: Boolean, default: false },
        generalLedger_view: { type: Boolean, default: false },
        
        // Tax Management Module
        tax_view: { type: Boolean, default: false },
        taxSettings_create: { type: Boolean, default: false },
        taxSettings_view: { type: Boolean, default: false },
        taxSettings_update: { type: Boolean, default: false },
        taxSettings_delete: { type: Boolean, default: false },
        salesTax_create: { type: Boolean, default: false },
        salesTax_view: { type: Boolean, default: false },
        salesTax_update: { type: Boolean, default: false },
        salesTax_delete: { type: Boolean, default: false },
        taxReports_view: { type: Boolean, default: false },
        form1099_create: { type: Boolean, default: false },
        form1099_view: { type: Boolean, default: false },
        form1099_update: { type: Boolean, default: false },
        form1099_delete: { type: Boolean, default: false },
        formW2_create: { type: Boolean, default: false },
        formW2_view: { type: Boolean, default: false },
        formW2_update: { type: Boolean, default: false },
        formW2_delete: { type: Boolean, default: false },
        
        // Products & Services Module
        products_create: { type: Boolean, default: false },
        products_view: { type: Boolean, default: false },
        products_update: { type: Boolean, default: false },
        products_delete: { type: Boolean, default: false },
        
        // Reports Module
        reports_view: { type: Boolean, default: false },
        profitLoss_view: { type: Boolean, default: false },
        balanceSheet_view: { type: Boolean, default: false },
        cashFlow_view: { type: Boolean, default: false },
        arAging_view: { type: Boolean, default: false },
        apAging_view: { type: Boolean, default: false },
        trialBalance_view: { type: Boolean, default: false },
        generalLedgerReport_view: { type: Boolean, default: false },
        taxSummary_view: { type: Boolean, default: false },
        
        // Settings Module
        settings_view: { type: Boolean, default: false },
        companySettings_view: { type: Boolean, default: false },
        companySettings_update: { type: Boolean, default: false },
        userManagement_create: { type: Boolean, default: false },
        userManagement_view: { type: Boolean, default: false },
        userManagement_update: { type: Boolean, default: false },
        userManagement_delete: { type: Boolean, default: false },
        paymentMethods_create: { type: Boolean, default: false },
        paymentMethods_view: { type: Boolean, default: false },
        paymentMethods_update: { type: Boolean, default: false },
        paymentMethods_delete: { type: Boolean, default: false },
        emailTemplates_create: { type: Boolean, default: false },
        emailTemplates_view: { type: Boolean, default: false },
        emailTemplates_update: { type: Boolean, default: false },
        emailTemplates_delete: { type: Boolean, default: false },
        integrations_create: { type: Boolean, default: false },
        integrations_view: { type: Boolean, default: false },
        integrations_update: { type: Boolean, default: false },
        integrations_delete: { type: Boolean, default: false },
        auditLogs_view: { type: Boolean, default: false }
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    mod_flag: {
        type: Boolean,
        default: false
    },
    del_flag: {
        type: Boolean,
        default: false
    },
    modifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    action_type: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false,
});

type RoleModel = Model<IRole>

const Role: RoleModel = models.Role ?? model<IRole>("Role", RoleSchema);

export default Role;