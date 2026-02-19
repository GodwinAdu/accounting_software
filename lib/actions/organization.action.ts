"use server"

import { connectToDB } from "../connection/mongoose"
import Organization from "../models/organization.model"
import User from "../models/user.model"
import Department from "../models/deparment.model"
import Role from "../models/role.model"
import { withAuth, type User as UserType } from "../helpers/auth"
import { hash } from "bcryptjs"
import { logAudit } from "../helpers/audit"
import { checkWriteAccess } from "../helpers/check-write-access"

interface RegisterOrganizationData {
    name: string
    email: string
    phone: string
    taxId?: string
    address: {
        street: string
        city: string
        state: string
        zipCode: string
        country: string
    }
    fullName: string
    password: string
    plan: "starter" | "professional" | "enterprise"
    modules: {
        dashboard: boolean
        banking: boolean
        sales: boolean
        expenses: boolean
        payroll: boolean
        accounting: boolean
        tax: boolean
        products: boolean
        reports: boolean
        settings: boolean
        projects: boolean
        crm: boolean
        budgeting: boolean
        assets: boolean
        ai: boolean
    }
}


export async function registerOrganization(data: RegisterOrganizationData) {
    try {
        await connectToDB();

        const [existingOrg, existingUser] = await Promise.all([
            Organization.findOne({ email: data.email }),
            User.findOne({ email: data.email }),
        ]);

        if (existingOrg) {
            return { success: false, error: "Organization with this email already exists" };
        }

        if (existingUser) {
            return { success: false, error: "User with this email already exists" };
        }

        const organizationCode = `ORG-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()}`;

        const employeeLimit = data.plan === "starter" ? 10 : data.plan === "professional" ? 100 : 999999;
        const trialStartDate = new Date();
        const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        const org = await Organization.create({
            organizationCode,
            name: data.name,
            email: data.email,
            phone: data.phone,
            taxId: data.taxId,
            address: data.address,
            modules: data.modules,
            subscriptionPlan: {
                plan: data.plan,
                status: "trial",
                startDate: trialStartDate,
                expiryDate: trialEndDate,
                employeeLimit,
                currentEmployees: 1,
            },
        });

        const passwordHash = await hash(data.password, 12);
        const employeeID = `EMP-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()}`;

        await Role.create({
            organizationId: org._id as any,
            name: "admin",
            displayName: "Administrator",
            description: "Full system access",
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
                // Banking Enhancements
                bankTransfers_create: true,
                bankTransfers_view: true,
                bankRules_create: true,
                bankRules_view: true,
                bankRules_update: true,
                bankRules_delete: true,
                cashForecast_view: true,
                // Sales Enhancements
                creditNotes_create: true,
                creditNotes_view: true,
                creditNotes_update: true,
                creditNotes_delete: true,
                customerPortal_view: true,
                paymentReminders_create: true,
                paymentReminders_view: true,
                // Expenses Enhancements
                expenseApprovals_create: true,
                expenseApprovals_view: true,
                expenseApprovals_update: true,
                vendorPortal_view: true,
                // Payroll Enhancements
                benefits_create: true,
                benefits_view: true,
                benefits_update: true,
                benefits_delete: true,
                employeePortal_view: true,
                loans_create: true,
                loans_view: true,
                loans_update: true,
                loans_delete: true,
                // Accounting Enhancements
                periodClose_create: true,
                periodClose_view: true,
                multiEntity_view: true,
                // Products Enhancements
                productCategories_create: true,
                productCategories_view: true,
                productCategories_update: true,
                productCategories_delete: true,
                inventory_create: true,
                inventory_view: true,
                inventory_update: true,
                inventory_delete: true,
                stockAdjustments_create: true,
                stockAdjustments_view: true,
                stockAdjustments_update: true,
                stockAdjustments_delete: true,
                warehouses_create: true,
                warehouses_view: true,
                warehouses_update: true,
                warehouses_delete: true,
                stockTransfers_create: true,
                stockTransfers_view: true,
                stockTransfers_update: true,
                reorderAlerts_view: true,
                batchExpiry_view: true,
                // Projects Module
                projects_view: true,
                projects_create: true,
                projects_update: true,
                projects_delete: true,
                projectBudgets_view: true,
                projectTime_view: true,
                projectProfitability_view: true,
                // CRM Module
                crm_view: true,
                leads_create: true,
                leads_view: true,
                leads_update: true,
                leads_delete: true,
                opportunities_create: true,
                opportunities_view: true,
                opportunities_update: true,
                opportunities_delete: true,
                contacts_create: true,
                contacts_view: true,
                contacts_update: true,
                contacts_delete: true,
                // Budgeting Module
                budgeting_view: true,
                budgets_create: true,
                budgets_view: true,
                budgets_update: true,
                budgets_delete: true,
                forecasting_view: true,
                // Fixed Assets Module
                assets_view: true,
                assets_create: true,
                assets_update: true,
                assets_delete: true,
                depreciation_view: true,
                assetCategories_view: true,
                // AI Module
                ai_view: true,
            },
        });

        const department = await Department.create({
            organizationId: org._id as any,
            name: "Administration",
            createdBy: null,
            action_type: "create",
        });

        const user = await User.create({
            organizationId: org._id as any,
            fullName: data.fullName,
            email: data.email,
            password: passwordHash,
            phone: data.phone,
            role: "admin",
            emailVerified: false,
        });

        await Department.findByIdAndUpdate(department._id, {
            createdBy: user._id,
        });

        await Organization.findByIdAndUpdate(org._id, {
            owner: user._id,
        });

        return { success: true };
    } catch (error) {
        console.error("Register organization error:", error);
        return { success: false, error: "Internal server error" };
    }
}


async function _fetchOrganizationUserById(user: UserType) {
    try {
        if (!user) throw new Error("User not authenticated")

        const organizationId = user.organizationId as string

        if (!organizationId) {
            throw new Error("User does not belong to any organization")
        }

        await connectToDB()

        const organization = await Organization.findById(organizationId).populate("owner", "fullName email")

        if (!organization) {
            throw new Error("Organization not found")
        }

        return JSON.parse(JSON.stringify(organization))
    } catch (error) {
        console.error("Fetch organization error:", error)
        throw new Error("Failed to fetch organization")
    }
}

export const fetchOrganizationUserById =await withAuth(_fetchOrganizationUserById)

async function _updateOrganizationProfile(user: UserType, data: {
    name: string
    email: string
    phone: string
    website?: string
    taxId?: string
    address: {
        street: string
        city: string
        state: string
        zipCode: string
        country: string
    }
    settings: {
        timezone: string
        currency: string
        fiscalYearStart: string
        dateFormat: string
    }
}) {
    try {
        await checkWriteAccess(String(user.organizationId));
        if (!user) throw new Error("User not authenticated")

        const organizationId = user.organizationId as string

        if (!organizationId) {
            throw new Error("User does not belong to any organization")
        }

        await connectToDB()

        const organization = await Organization.findByIdAndUpdate(
            organizationId,
            {
                name: data.name,
                email: data.email,
                phone: data.phone,
                website: data.website,
                taxId: data.taxId,
                address: data.address,
                settings: data.settings,
            },
            { new: true }
        )

        if (!organization) {
            throw new Error("Organization not found")
        }

        await logAudit({
            organizationId,
            userId: String(user._id || user.id),
            action: "update",
            resource: "organization",
            resourceId: organizationId,
            details: { after: data },
        })

        return { success: true, organization: JSON.parse(JSON.stringify(organization)) }
    } catch (error) {
        console.error("Update organization error:", error)
        return { success: false, error: "Failed to update organization" }
    }
}

export const updateOrganizationProfile = await withAuth(_updateOrganizationProfile)

async function _resetOrganizationSettings(user: UserType) {
    try {
        await checkWriteAccess(String(user.organizationId));
        if (!user) throw new Error("User not authenticated")

        const organizationId = user.organizationId as string

        if (!organizationId) {
            throw new Error("User does not belong to any organization")
        }

        await connectToDB()

        await Organization.findByIdAndUpdate(organizationId, {
            settings: {
                timezone: "Africa/Accra",
                currency: "GHS",
                fiscalYearStart: "01-01",
                dateFormat: "DD/MM/YYYY",
                timeFormat: "24h",
                language: "en",
                numberFormat: "1,234.56",
                weekStart: "Monday"
            },
            paymentSettings: {
                acceptedPaymentMethods: ["Bank Transfer", "Credit Card", "Mobile Money"],
                paymentTerms: 30,
                lateFeePercentage: 0,
                earlyPaymentDiscount: 0
            },
            invoiceSettings: {
                invoicePrefix: "INV",
                invoiceNumberFormat: "INV-{YYYY}-{####}",
                nextInvoiceNumber: 1,
                showTaxNumber: true,
                showLogo: true
            },
            taxSettings: {
                taxRegistered: false,
                taxRate: 0,
                enableTaxCalculation: true
            },
            payrollSettings: {
                payrollFrequency: "monthly",
                overtimeRate: 1.5,
                enableTimeTracking: true,
                enableLeaveManagement: true,
                defaultWorkingHours: 8,
                defaultWorkingDays: 5
            },
            emailSettings: {
                enableEmailNotifications: true
            },
            notificationSettings: {
                invoiceReminders: true,
                paymentReceived: true,
                lowStock: true,
                expenseApproval: true,
                payrollProcessed: true,
                subscriptionExpiry: true
            },
            security: {
                twoFactorRequired: false,
                sessionTimeout: 30,
                passwordExpiry: 90,
                ipWhitelist: [],
                allowedDomains: [],
                loginAttempts: 5,
                lockoutDuration: 30
            }
        })

        await logAudit({
            organizationId,
            userId: String(user._id || user.id),
            action: "update",
            resource: "settings",
            resourceId: organizationId,
            details: { metadata: { action: "reset_to_defaults" } },
        })

        return { success: true }
    } catch (error) {
        console.error("Reset settings error:", error)
        return { success: false, error: "Failed to reset settings" }
    }
}

export const resetOrganizationSettings = await withAuth(_resetOrganizationSettings)

async function _deleteOrganizationData(user: UserType) {
    try {
        await checkWriteAccess(String(user.organizationId));
        if (!user) throw new Error("User not authenticated")

        const organizationId = user.organizationId as string

        if (!organizationId) {
            throw new Error("User does not belong to any organization")
        }

        await connectToDB()

        await logAudit({
            organizationId,
            userId: String(user._id || user.id),
            action: "delete",
            resource: "organization",
            resourceId: organizationId,
            details: { metadata: { action: "delete_all_data" } },
        })

        // TODO: Delete all related data from other collections
        // This is a placeholder - implement based on your data models
        // await Invoice.deleteMany({ organizationId })
        // await Transaction.deleteMany({ organizationId })
        // await Employee.deleteMany({ organizationId })
        // await Product.deleteMany({ organizationId })
        // etc.

        return { success: true }
    } catch (error) {
        console.error("Delete data error:", error)
        return { success: false, error: "Failed to delete data" }
    }
}

export const deleteOrganizationData = await withAuth(_deleteOrganizationData)

async function _deleteOrganization(user: UserType) {
    try {
        await checkWriteAccess(String(user.organizationId));
        if (!user) throw new Error("User not authenticated")

        const organizationId = user.organizationId as string

        if (!organizationId) {
            throw new Error("User does not belong to any organization")
        }

        await connectToDB()

        await logAudit({
            organizationId,
            userId: String(user._id || user.id),
            action: "delete",
            resource: "organization",
            resourceId: organizationId,
            details: { metadata: { action: "delete_organization" } },
        })

        // Delete organization and all related data
        await Organization.findByIdAndDelete(organizationId)
        await User.deleteMany({ organizationId: organizationId })
        await Department.deleteMany({ organizationId: organizationId })
        await Role.deleteMany({ organizationId: organizationId })

        // TODO: Delete all other related data
        // await Invoice.deleteMany({ organizationId })
        // await Transaction.deleteMany({ organizationId })
        // etc.

        return { success: true }
    } catch (error) {
        console.error("Delete organization error:", error)
        return { success: false, error: "Failed to delete organization" }
    }
}

export const deleteOrganization = await withAuth(_deleteOrganization)


async function _getOrganizationUsers(user: UserType) {
    try {
        if (!user) throw new Error("User not authenticated");
        const organizationId = user.organizationId;
        await connectToDB();
        const users = await User.find({ organizationId: organizationId }).select("-password").sort({ createdAt: -1 });
        if (!users || users.length === 0) return []
        return { success: true, users: JSON.parse(JSON.stringify(users)) }

    } catch (error) {
        console.error("Get organization users error:", error)
        return { success: false, error: "Failed to get organization users" }
    }
}

export const getOrganizationUsers = await withAuth(_getOrganizationUsers)
