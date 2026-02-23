"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Shield,
    Search,
    BookOpen,
    FileText,
    CreditCard,
    Settings,
    Briefcase,
    ChevronDown,
    ChevronUp,
    Eye,
    Edit,
    Trash,
    CheckCircle2,
    XCircle,
    Info,
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
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

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
    equity: {
        title: "Equity",
        icon: <Landmark className="h-5 w-5" />,
        description: "Owner investments and drawings",
        module: "equity",
        permissions: [
            "equity_view",
            "equity_create",
            "equity_edit",
            "equity_delete",
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

// Function to get a human-readable name from a camelCase permission key
const getReadableName = (key: string) => {
    if (key === "hr") return "HR"
    if (key === "hrManagement") return "HR Management"
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
}

interface IRole {
    _id: string
    name: string
    displayName: string
    description: string
    permissions: Record<string, boolean>
    createdAt: string
    updatedAt: string
    userCount: string[]
    usersCount?: number
}

const RolesDisplayPage = ({ roles, enabledModules }: { roles: IRole[]; enabledModules: Record<string, boolean> }) => {
    const router = useRouter()
    const params = useParams()
    const { organizationId, userId } = params
    const [selectedRole, setSelectedRole] = useState<IRole | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [expandedSections, setExpandedSections] = useState<string[]>([])
    const [viewMode, setViewMode] = useState<"list" | "grid" | "comparison">("list")
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [roleToDelete, setRoleToDelete] = useState<IRole | null>(null)
    const [permissionFilter, setPermissionFilter] = useState<string>("all")

    // Set the first role as selected by default
    useEffect(() => {
        if (roles.length > 0 && !selectedRole) {
            setSelectedRole(roles[0])
        }
    }, [roles, selectedRole])

    // Function to count enabled permissions in a category for a role
    const countEnabledPermissions = (role: IRole, category: string) => {
        const permissions = permissionCategories[category as keyof typeof permissionCategories].permissions
        return permissions.filter((p) => role.permissions[p]).length
    }

    // Function to get total permissions in a category
    const getTotalPermissions = (category: string) => {
        return permissionCategories[category as keyof typeof permissionCategories].permissions.length
    }

    // Function to check if a permission matches the search term
    const matchesSearch = (permission: string) => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        const permissionName = getReadableName(permission).toLowerCase()
        return permissionName.includes(searchLower)
    }

    // Toggle expanding/collapsing all sections
    const toggleAllSections = () => {
        if (expandedSections.length === Object.keys(permissionCategories).length) {
            setExpandedSections([])
        } else {
            setExpandedSections(Object.keys(permissionCategories))
        }
    }

    // Function to handle role deletion
    const handleDeleteRole = () => {
        if (roleToDelete) {
            // Filter out the role to delete
            // If the deleted role was selected, select the first remaining role
            if (selectedRole && selectedRole._id === roleToDelete._id) {
                const remainingRoles = roles.filter((role) => role._id !== roleToDelete._id)
                setSelectedRole(remainingRoles.length > 0 ? remainingRoles[0] : null)
            }
            setShowDeleteDialog(false)
            setRoleToDelete(null)
        }
    }

    // Function to calculate the total number of permissions for a role
    const getTotalEnabledPermissions = (role: IRole) => {
        return Object.values(role.permissions).filter(Boolean).length
    }

    // Function to calculate the total number of all possible permissions
    const getTotalPossiblePermissions = () => {
        return Object.values(permissionCategories).reduce((total, category) => total + category.permissions.length, 0)
    }

    // Function to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date)
    }

    // Function to get role type badge
    const getRoleTypeBadge = (role: IRole) => {
        const totalEnabled = getTotalEnabledPermissions(role)
        const totalPossible = getTotalPossiblePermissions()
        
        if (totalEnabled === totalPossible) {
            return (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    FULL ACCESS
                </Badge>
            )
        } else if (totalEnabled > totalPossible / 2) {
            return (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    ADVANCED
                </Badge>
            )
        } else if (totalEnabled > 0) {
            return (
                <Badge variant="outline" className="text-muted-foreground">
                    LIMITED
                </Badge>
            )
        }
        return (
            <Badge variant="outline" className="text-muted-foreground">
                BASIC
            </Badge>
        )
    }

    // Filter roles based on permission filter
    const filteredRoles = roles.filter((role) => {
        if (permissionFilter === "all") return true
        return role.permissions[permissionFilter as keyof typeof role.permissions]
    })

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex flex-col space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <Select value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "grid" | "comparison")}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="View Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="list">List View</SelectItem>
                            <SelectItem value="grid">Grid View</SelectItem>
                            <SelectItem value="comparison">Comparison View</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* Main Content */}
                {viewMode === "comparison" ? (
                    <RoleComparisonView roles={roles} enabledModules={enabledModules} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Roles List */}
                        <Card className="lg:col-span-1">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-primary" />
                                        Roles
                                    </CardTitle>
                                    <Badge variant="outline">{roles.length}</Badge>
                                </div>
                                <CardDescription>All available user roles in your system</CardDescription>
                                <div className="mt-2 space-y-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search roles..."
                                            className="pl-10"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <Select value={permissionFilter} onValueChange={setPermissionFilter}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Filter by permission" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Roles</SelectItem>
                                            <SelectItem value="dashboard_view">Dashboard Access</SelectItem>
                                            <SelectItem value="banking_view">Banking</SelectItem>
                                            <SelectItem value="sales_view">Sales</SelectItem>
                                            <SelectItem value="expenses_view">Expenses</SelectItem>
                                            <SelectItem value="payroll_view">Payroll</SelectItem>
                                            <SelectItem value="accounting_view">Accounting</SelectItem>
                                            <SelectItem value="tax_view">Tax</SelectItem>
                                            <SelectItem value="reports_view">Reports</SelectItem>
                                            <SelectItem value="projects_view">Projects</SelectItem>
                                            <SelectItem value="crm_view">CRM</SelectItem>
                                            <SelectItem value="budgeting_view">Budgeting</SelectItem>
                                            <SelectItem value="assets_view">Fixed Assets</SelectItem>
                                            <SelectItem value="equity_view">Equity</SelectItem>
                                            <SelectItem value="ai_view">AI Assistant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-2">
                                    {viewMode === "list" ? (
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Role</TableHead>
                                                        <TableHead className="text-right">Users</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredRoles
                                                        .filter((role) =>
                                                            searchTerm
                                                                ? role.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                                role.description.toLowerCase().includes(searchTerm.toLowerCase())
                                                                : true,
                                                        )
                                                        .map((role) => (
                                                            <TableRow
                                                                key={role._id}
                                                                className={cn(
                                                                    "cursor-pointer transition-colors",
                                                                    selectedRole?._id === role._id ? "bg-muted/50" : "",
                                                                )}
                                                                onClick={() => setSelectedRole(role)}
                                                            >
                                                                <TableCell className="font-medium">
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-medium">{role.displayName}</span>
                                                                            {getRoleTypeBadge(role)}
                                                                        </div>
                                                                        <div className="text-sm text-muted-foreground">{role.description}</div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Badge variant="outline">{role.userCount?.length || 0}</Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="icon">
                                                                                <ChevronDown className="h-4 w-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    setSelectedRole(role)
                                                                                }}
                                                                                className="cursor-pointer"
                                                                            >
                                                                                <Eye className="mr-2 h-4 w-4" />
                                                                                View Details
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    router.push(
                                                                                        `/${organizationId}/dashboard/${userId}/settings/roles/${role._id}`,
                                                                                    )
                                                                                }}
                                                                                className="cursor-pointer"
                                                                                // disabled={role.name === "admin"}
                                                                            >
                                                                                <Edit className="mr-2 h-4 w-4" />
                                                                                Edit Role
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    setRoleToDelete(role)
                                                                                    setShowDeleteDialog(true)
                                                                                }}
                                                                                className="cursor-pointer text-destructive focus:text-destructive"
                                                                                disabled={role.name === "admin"}
                                                                            >
                                                                                <Trash className="mr-2 h-4 w-4" />
                                                                                Delete Role
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-3">
                                            {filteredRoles
                                                .filter((role) =>
                                                    searchTerm
                                                        ? role.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                        role.description.toLowerCase().includes(searchTerm.toLowerCase())
                                                        : true,
                                                )
                                                .map((role) => (
                                                    <div
                                                        key={role._id}
                                                        className={cn(
                                                            "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                                                            selectedRole?._id === role._id ? "bg-muted/50 border-primary shadow-sm" : "",
                                                        )}
                                                        onClick={() => setSelectedRole(role)}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-medium">{role.displayName}</h3>
                                                                    {getRoleTypeBadge(role)}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">{role.description}</p>
                                                            </div>
                                                            <Badge variant="outline">{role.userCount?.length || 0} users</Badge>
                                                        </div>
                                                        <div className="mt-3 flex items-center justify-between">
                                                            <div className="text-xs text-muted-foreground">Updated {formatDate(role.updatedAt)}</div>
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        router.push(
                                                                            `/${organizationId}/dashboard/${userId}/settings/roles/${role._id}`,
                                                                        )
                                                                    }}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setRoleToDelete(role)
                                                                        setShowDeleteDialog(true)
                                                                    }}
                                                                >
                                                                    <Trash className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Role Details */}
                        {selectedRole && (
                            <Card className="lg:col-span-2">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Shield className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <CardTitle>{selectedRole.displayName}</CardTitle>
                                                    {getRoleTypeBadge(selectedRole)}
                                                </div>
                                                <CardDescription className="mt-1">{selectedRole.description}</CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={selectedRole.name === "admin"}
                                                onClick={() =>
                                                    router.push(`/${organizationId}/dashboard/${userId}/settings/roles/${selectedRole._id}`)
                                                }
                                                className="gap-1"
                                            >
                                                <Edit className="h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                disabled={selectedRole.name === "admin"}
                                                onClick={() => {
                                                    setRoleToDelete(selectedRole)
                                                    setShowDeleteDialog(true)
                                                }}
                                                className="gap-1"
                                            >
                                                <Trash className="h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex flex-col p-3 border rounded-md bg-muted/30">
                                            <span className="text-sm text-muted-foreground">Internal Name</span>
                                            <span className="font-medium">{selectedRole.name}</span>
                                        </div>
                                        <div className="flex flex-col p-3 border rounded-md bg-muted/30">
                                            <span className="text-sm text-muted-foreground">Users Assigned</span>
                                            <span className="font-medium">{selectedRole.userCount?.length || 0}</span>
                                        </div>
                                        <div className="flex flex-col p-3 border rounded-md bg-muted/30">
                                            <span className="text-sm text-muted-foreground">Permissions</span>
                                            <span className="font-medium">
                                                {getTotalEnabledPermissions(selectedRole)} / {getTotalPossiblePermissions()}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    placeholder="Search permissions..."
                                                    className="w-[250px]"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                                {searchTerm && (
                                                    <Badge variant="outline" className="gap-1">
                                                        <Search className="h-3 w-3" />
                                                        {searchTerm}
                                                    </Badge>
                                                )}
                                            </div>
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
                                        </div>

                                        <Accordion
                                            type="multiple"
                                            value={expandedSections}
                                            onValueChange={setExpandedSections}
                                            className="space-y-4"
                                        >
                                            {Object.entries(permissionCategories).map(
                                                ([category, { title, icon, description, permissions, module }]) => {
                                                    const enabledCount = countEnabledPermissions(selectedRole, category)
                                                    const totalCount = getTotalPermissions(category)
                                                    const hasMatchingPermissions = permissions.some((permission) => matchesSearch(permission))
                                                    const isModuleDisabled = !enabledModules[module]

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
                                                                                isModuleDisabled ? "bg-gray-100 text-gray-400" : "bg-emerald-100 text-emerald-600",
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
                                                                    <Badge
                                                                        variant={enabledCount > 0 ? "default" : "outline"}
                                                                        className={cn(
                                                                            "transition-colors",
                                                                            enabledCount === 0 && "text-muted-foreground",
                                                                            enabledCount === totalCount && "bg-emerald-500 hover:bg-emerald-600",
                                                                            enabledCount > 0 &&
                                                                            enabledCount < totalCount &&
                                                                            "bg-blue-500 hover:bg-blue-600",
                                                                        )}
                                                                    >
                                                                        {enabledCount === totalCount
                                                                            ? "Full Access"
                                                                            : enabledCount > 0
                                                                                ? "Partial Access"
                                                                                : "No Access"}
                                                                    </Badge>
                                                                </div>
                                                            </AccordionTrigger>
                                                            <AccordionContent className="px-4 py-3 border-t bg-white dark:bg-gray-950">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {permissions.map((permission) => {
                                                                        if (searchTerm && !matchesSearch(permission)) return null
                                                                        const isEnabled = selectedRole.permissions[permission]

                                                                        return (
                                                                            <div
                                                                                key={permission}
                                                                                className={cn(
                                                                                    "flex items-start gap-3 p-3 rounded-md border transition-all",
                                                                                    isEnabled && "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20",
                                                                                    !isEnabled && "bg-gray-50 border-gray-200 dark:bg-gray-900/50",
                                                                                )}
                                                                            >
                                                                                {isEnabled ? (
                                                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                                                                                ) : (
                                                                                    <XCircle className="h-5 w-5 text-gray-300 dark:text-gray-600 mt-0.5 shrink-0" />
                                                                                )}
                                                                                <div className="flex-1 min-w-0">
                                                                                    <div className="font-medium">{getReadableName(permission)}</div>
                                                                                    <div
                                                                                        className={cn(
                                                                                            "text-sm mt-1",
                                                                                            isEnabled
                                                                                                ? "text-emerald-700 dark:text-emerald-400"
                                                                                                : "text-muted-foreground",
                                                                                        )}
                                                                                    >
                                                                                        {isEnabled ? "Enabled" : "Disabled"}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    )
                                                },
                                            )}
                                        </Accordion>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t bg-muted/50 flex justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        Last updated: {formatDate(selectedRole.updatedAt)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Created: {formatDate(selectedRole.createdAt)}</div>
                                </CardFooter>
                            </Card>
                        )}
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Role</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete the role "{roleToDelete?.displayName}"? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        {roleToDelete && (roleToDelete.usersCount || roleToDelete.userCount?.length) && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-3 my-2">
                                <div className="flex items-start gap-2">
                                    <Info className="h-5 w-5 text-amber-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Warning: Users will be affected</p>
                                        <p className="text-sm">
                                            This role is currently assigned to {roleToDelete.usersCount || roleToDelete.userCount?.length}{" "}
                                            users. Deleting it will remove these permissions from those users.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteRole}>
                                Delete Role
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

// Role Comparison View Component
const RoleComparisonView = ({ roles, enabledModules }: { roles: IRole[]; enabledModules: Record<string, boolean> }) => {
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    // Toggle role selection for comparison
    const toggleRoleSelection = (roleId: string) => {
        if (selectedRoles.includes(roleId)) {
            setSelectedRoles(selectedRoles.filter((id) => id !== roleId))
        } else {
            setSelectedRoles([...selectedRoles, roleId])
        }
    }

    // Get selected roles data
    const selectedRolesData = roles.filter((role) => selectedRoles.includes(role._id as string))

    // Function to check if a permission matches the search term
    const matchesSearch = (permission: string) => {
        if (!searchTerm) return true
        const searchLower = searchTerm.toLowerCase()
        const permissionName = getReadableName(permission).toLowerCase()
        return permissionName.includes(searchLower)
    }

    // Filter categories based on search
    const filteredCategories = Object.entries(permissionCategories).filter(([_, { permissions }]) => {
        if (!searchTerm) return true
        return permissions.some((permission) => matchesSearch(permission))
    })

    // Function to get role type badge
    const getRoleTypeBadge = (role: IRole) => {
        const totalEnabled = Object.values(role.permissions).filter(Boolean).length
        const totalPossible = Object.keys(role.permissions).length
        
        if (totalEnabled === totalPossible) {
            return (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    FULL ACCESS
                </Badge>
            )
        } else if (totalEnabled > totalPossible / 2) {
            return (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    ADVANCED
                </Badge>
            )
        }
        return (
            <Badge variant="outline" className="text-muted-foreground">
                LIMITED
            </Badge>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Role Comparison
                            </CardTitle>
                            <CardDescription>Select roles to compare their permissions side by side</CardDescription>
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {roles.map((role) => (
                            <div key={role._id} className="flex items-center gap-2">
                                <Badge
                                    variant={selectedRoles.includes(role._id as string) ? "default" : "outline"}
                                    className="cursor-pointer transition-all hover:shadow-sm"
                                    onClick={() => toggleRoleSelection(role._id as string)}
                                >
                                    {role.displayName}
                                    {selectedRoles.includes(role._id as string) && <XCircle className="ml-1 h-3 w-3" />}
                                </Badge>
                                {selectedRoles.includes(role._id as string) && getRoleTypeBadge(role)}
                            </div>
                        ))}
                    </div>
                </CardHeader>
                <CardContent>
                    {selectedRolesData.length === 0 ? (
                        <div className="text-center py-12">
                            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">No roles selected</h3>
                            <p className="text-muted-foreground">Select roles above to compare their permissions</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search permissions..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-1/3 bg-muted/50">Permission</TableHead>
                                            {selectedRolesData.map((role) => (
                                                <TableHead key={role._id} className="text-center bg-muted/50">
                                                    <div className="space-y-1">
                                                        <div className="font-medium">{role.displayName}</div>
                                                        <div className="text-xs text-muted-foreground">{role.description}</div>
                                                    </div>
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCategories.map(([category, { title, permissions, module }]) => (
                                            <React.Fragment key={category}>
                                                <TableRow className="bg-muted/30">
                                                    <TableCell
                                                        colSpan={selectedRolesData.length + 1}
                                                        className={cn("font-bold py-3", !enabledModules[module] && "text-gray-400")}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {title}
                                                            {!enabledModules[module] && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs px-1.5 py-0 h-4 bg-gray-100 text-gray-500"
                                                                >
                                                                    DISABLED
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                {permissions
                                                    .filter((permission) => matchesSearch(permission))
                                                    .map((permission) => (
                                                        <TableRow key={permission}>
                                                            <TableCell className="font-medium">
                                                                {getReadableName(permission)}
                                                            </TableCell>
                                                            {selectedRolesData.map((role) => (
                                                                <TableCell key={`${role._id}-${permission}`} className="text-center">
                                                                    {role.permissions[permission] ? (
                                                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                                                                    ) : (
                                                                        <XCircle className="h-5 w-5 text-gray-300 dark:text-gray-600 mx-auto" />
                                                                    )}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default RolesDisplayPage