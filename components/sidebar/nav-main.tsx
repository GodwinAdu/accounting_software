"use client";

import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";
import type React from "react";
import {
  Users,
  ChevronRight,
  ShoppingBag,
  HandCoins,
  Settings,
  UsersRound,
  BookOpen,
  History,
  Receipt,
  Calendar,
  CheckSquare,
  UserCheck,
  FileText,
  Clock,
  Shield,
  Award,
  TrendingUp,
  DollarSign,
  Package,
  Search,
  CheckCircle,
  BarChart3,
  FileBarChart,
  Calculator,
  CreditCard,
  Wallet,
  BookMarked,
  Building2,
  Zap,
  Briefcase,
  Globe,
  Repeat,
  Mail,
  MessageSquare,
  Target,
  Lightbulb,
  Boxes,
  ArrowLeftRight,
  Banknote,
  FileCheck,
  RefreshCw,
  CreditCard as CreditCardIcon,
  Bell,
  FileOutput,
  Percent,
  Warehouse,
  BarChart2,
  Building,
  Landmark,
  PiggyBank,
  Sparkles,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useCallback, useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { IRole, IOrganization } from "@/types";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  roleField?: keyof IRole | string;
  isActive?: boolean;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  items?: NavItem[];
  description?: string;
  isNew?: boolean;
  isPro?: boolean;
}

interface NavMainProps {
  role: IRole | undefined;
  organization: IOrganization;
}

export function NavMain({ role, organization }: NavMainProps) {
  const params = useParams();
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const proPlan = organization?.subscriptionPlan?.plan === "professional";
  const { organizationId, userId } = params;

  const navMain: (NavItem | false)[] = [
    {
      title: "Dashboard",
      url: `/${organizationId}/dashboard/${userId}`,
      icon: BarChart3,
      description: "Financial overview",
    },
    organization?.modules?.banking && {
      title: "Banking",
      url: "#",
      icon: CreditCard,
      description: "Bank accounts & transactions",
      roleField: "banking_view",
      items: [
        {
          title: "Bank Accounts",
          url: `/${organizationId}/dashboard/${userId}/banking/accounts`,
          icon: Wallet,
          roleField: "bankAccounts_view",
        },
        {
          title: "Transactions",
          url: `/${organizationId}/dashboard/${userId}/banking/transactions`,
          icon: Receipt,
          roleField: "transactions_view",
        },
        {
          title: "Reconciliation",
          url: `/${organizationId}/dashboard/${userId}/banking/reconciliation`,
          icon: CheckCircle,
          roleField: "reconciliation_view",
        },
        {
          title: "Bank Feeds",
          url: `/${organizationId}/dashboard/${userId}/banking/feeds`,
          icon: Zap,
          roleField: "bankFeeds_view",
        },
        {
          title: "Transfers",
          url: `/${organizationId}/dashboard/${userId}/banking/transfers`,
          icon: ArrowLeftRight,
          roleField: "bankTransfers_view",
          isNew: true,
        },
        {
          title: "Bank Rules",
          url: `/${organizationId}/dashboard/${userId}/banking/rules`,
          icon: FileCheck,
          roleField: "bankRules_view",
          isNew: true,
        },
        {
          title: "Cash Forecast",
          url: `/${organizationId}/dashboard/${userId}/banking/forecast`,
          icon: TrendingUp,
          roleField: "cashForecast_view",
          isPro: true,
        },
      ],
    },
    organization?.modules?.sales && {
      title: "Sales & Invoicing",
      url: "#",
      icon: Receipt,
      description: "Invoices & customer payments",
      roleField: "sales_view",
      items: [
        {
          title: "Invoices",
          url: `/${organizationId}/dashboard/${userId}/sales/invoices`,
          icon: FileText,
          roleField: "invoices_view",
        },
        {
          title: "Recurring Invoices",
          url: `/${organizationId}/dashboard/${userId}/sales/recurring-invoices`,
          icon: Repeat,
          roleField: "recurringInvoices_view",
        },
        {
          title: "Customers",
          url: `/${organizationId}/dashboard/${userId}/sales/customers`,
          icon: Users,
          roleField: "customers_view",
        },
        {
          title: "Estimates",
          url: `/${organizationId}/dashboard/${userId}/sales/estimates`,
          icon: Calculator,
          roleField: "estimates_view",
        },
        {
          title: "Payments Received",
          url: `/${organizationId}/dashboard/${userId}/sales/payments`,
          icon: DollarSign,
          roleField: "paymentsReceived_view",
        },
        {
          title: "Sales Receipts",
          url: `/${organizationId}/dashboard/${userId}/sales/receipts`,
          icon: Receipt,
          roleField: "salesReceipts_view",
        },
        {
          title: "Credit Notes",
          url: `/${organizationId}/dashboard/${userId}/sales/credit-notes`,
          icon: FileOutput,
          roleField: "creditNotes_view",
          isNew: true,
        },
        {
          title: "Sales Orders",
          url: `/${organizationId}/dashboard/${userId}/sales/sales-orders`,
          icon: ShoppingBag,
          roleField: "invoices_view",
          isNew: true,
        },
        {
          title: "Customer Portal",
          url: `/${organizationId}/dashboard/${userId}/sales/portal`,
          icon: Globe,
          roleField: "customerPortal_view",
          isNew: true,
        },
        {
          title: "Payment Reminders",
          url: `/${organizationId}/dashboard/${userId}/sales/reminders`,
          icon: Bell,
          roleField: "paymentReminders_view",
          isNew: true,
        },
      ],
    },
    organization?.modules?.expenses && {
      title: "Expenses & Bills",
      url: "#",
      icon: HandCoins,
      description: "Bills & vendor payments",
      roleField: "expenses_view",
      items: [
        {
          title: "Expenses",
          url: `/${organizationId}/dashboard/${userId}/expenses/all`,
          icon: Receipt,
          roleField: "expenses_view",
        },
        {
          title: "Recurring Expenses",
          url: `/${organizationId}/dashboard/${userId}/expenses/recurring`,
          icon: Repeat,
          roleField: "recurringExpenses_view",
        },
        {
          title: "Bills",
          url: `/${organizationId}/dashboard/${userId}/expenses/bills`,
          icon: FileText,
          roleField: "bills_view",
        },
        {
          title: "Vendors",
          url: `/${organizationId}/dashboard/${userId}/expenses/vendors`,
          icon: UsersRound,
          roleField: "vendors_view",
        },
        {
          title: "Purchase Orders",
          url: `/${organizationId}/dashboard/${userId}/expenses/purchase-orders`,
          icon: ShoppingBag,
          roleField: "purchaseOrders_view",
        },
        {
          title: "Expense Categories",
          url: `/${organizationId}/dashboard/${userId}/expenses/categories`,
          icon: CheckSquare,
          roleField: "expenseCategories_view",
        },
        {
          title: "Approval Workflow",
          url: `/${organizationId}/dashboard/${userId}/expenses/approvals`,
          icon: FileCheck,
          roleField: "expenseApprovals_view",
          isNew: true,
        },
        {
          title: "Vendor Portal",
          url: `/${organizationId}/dashboard/${userId}/expenses/vendor-portal`,
          icon: Globe,
          roleField: "vendorPortal_view",
          isNew: true,
        },
      ],
    },

    organization?.modules?.payroll && {
      title: "Payroll",
      url: "#",
      icon: Wallet,
      description: "Employee payroll management",
      roleField: "payroll_view",
      items: [
        {
          title: "Employees",
          url: `/${organizationId}/dashboard/${userId}/payroll/employees`,
          icon: Users,
          roleField: "employees_view",
        },
        {
          title: "Run Payroll",
          url: `/${organizationId}/dashboard/${userId}/payroll/run`,
          icon: DollarSign,
          roleField: "runPayroll_view",
        },
        {
          title: "Payroll History",
          url: `/${organizationId}/dashboard/${userId}/payroll/history`,
          icon: History,
          roleField: "payrollHistory_view",
        },
        {
          title: "Time Tracking",
          url: `/${organizationId}/dashboard/${userId}/payroll/time-tracking`,
          icon: Clock,
          roleField: "timeTracking_view",
        },
        {
          title: "Leave Management",
          url: `/${organizationId}/dashboard/${userId}/payroll/leave`,
          icon: Calendar,
          roleField: "leaveManagement_view",
        },
        {
          title: "Deductions",
          url: `/${organizationId}/dashboard/${userId}/payroll/deductions`,
          icon: Calculator,
          roleField: "deductions_view",
        },
        {
          title: "Benefits",
          url: `/${organizationId}/dashboard/${userId}/payroll/benefits`,
          icon: Award,
          roleField: "benefits_view",
          isNew: true,
        },
        {
          title: "Employee Portal",
          url: `/${organizationId}/dashboard/${userId}/payroll/employee-portal`,
          icon: Globe,
          roleField: "employeePortal_view",
          isNew: true,
        },
        {
          title: "Loans",
          url: `/${organizationId}/dashboard/${userId}/payroll/loans`,
          icon: Banknote,
          roleField: "loans_view",
          isNew: true,
        },
      ],
    },
    organization?.modules?.accounting && {
      title: "Accounting",
      url: "#",
      icon: BookMarked,
      description: "Chart of accounts & ledger",
      roleField: "accounting_view",
      items: [
        {
          title: "Chart of Accounts",
          url: `/${organizationId}/dashboard/${userId}/accounting/chart-of-accounts`,
          icon: BookOpen,
          roleField: "chartOfAccounts_view",
        },
        {
          title: "Journal Entries",
          url: `/${organizationId}/dashboard/${userId}/accounting/journal-entries`,
          icon: FileText,
          roleField: "journalEntries_view",
        },
        {
          title: "General Ledger",
          url: `/${organizationId}/dashboard/${userId}/accounting/general-ledger`,
          icon: BookMarked,
          roleField: "generalLedger_view",
        },
        {
          title: "Period Close",
          url: `/${organizationId}/dashboard/${userId}/accounting/period-close`,
          icon: FileCheck,
          roleField: "periodClose_view",
          isNew: true,
        },
        {
          title: "Multi-Entity",
          url: `/${organizationId}/dashboard/${userId}/accounting/multi-entity`,
          icon: Building2,
          roleField: "multiEntity_view",
          isPro: true,
        },
      ],
    },
    organization?.modules?.tax && {
      title: "Tax Management",
      url: "#",
      icon: Calculator,
      description: "Tax compliance & filing",
      roleField: "tax_view",
      items: [
        {
          title: "Tax Settings",
          url: `/${organizationId}/dashboard/${userId}/tax/settings`,
          icon: Settings,
          roleField: "taxSettings_view",
        },
        {
          title: "Sales Tax",
          url: `/${organizationId}/dashboard/${userId}/tax/sales-tax`,
          icon: DollarSign,
          roleField: "salesTax_view",
        },
        {
          title: "Tax Reports",
          url: `/${organizationId}/dashboard/${userId}/tax/reports`,
          icon: FileBarChart,
          roleField: "taxReports_view",
        },
        {
          title: "1099 Forms",
          url: `/${organizationId}/dashboard/${userId}/tax/1099`,
          icon: FileText,
          roleField: "form1099_view",
        },
        {
          title: "W-2 Forms",
          url: `/${organizationId}/dashboard/${userId}/tax/w2`,
          icon: FileText,
          roleField: "formW2_view",
        },
      ],
    },
    organization?.modules?.products && {
      title: "Products & Services",
      url: "#",
      icon: Package,
      description: "Product catalog & inventory",
      roleField: "products_view",
      items: [
        {
          title: "All Products",
          url: `/${organizationId}/dashboard/${userId}/products/all`,
          icon: Package,
          roleField: "products_view",
        },
        {
          title: "Categories",
          url: `/${organizationId}/dashboard/${userId}/products/categories`,
          icon: CheckSquare,
          roleField: "productCategories_view",
        },
        {
          title: "Inventory",
          url: `/${organizationId}/dashboard/${userId}/products/inventory`,
          icon: ShoppingBag,
          roleField: "inventory_view",
        },
        {
          title: "Stock Adjustments",
          url: `/${organizationId}/dashboard/${userId}/products/adjustments`,
          icon: History,
          roleField: "stockAdjustments_view",
        },
        {
          title: "Reorder Alerts",
          url: `/${organizationId}/dashboard/${userId}/products/reorder`,
          icon: Bell,
          roleField: "reorderAlerts_view",
          isNew: true,
        },
      ],
    },
    organization?.modules?.reports && {
      title: "Reports",
      url: "#",
      icon: FileBarChart,
      description: "Financial reports & analytics",
      roleField: "reports_view",
      items: [
        {
          title: "Profit & Loss",
          url: `/${organizationId}/dashboard/${userId}/reports/profit-loss`,
          icon: TrendingUp,
          roleField: "profitLoss_view",
        },
        {
          title: "Balance Sheet",
          url: `/${organizationId}/dashboard/${userId}/reports/balance-sheet`,
          icon: BarChart3,
          roleField: "balanceSheet_view",
        },
        {
          title: "Cash Flow",
          url: `/${organizationId}/dashboard/${userId}/reports/cash-flow`,
          icon: DollarSign,
          roleField: "cashFlow_view",
        },
        {
          title: "AR Aging",
          url: `/${organizationId}/dashboard/${userId}/reports/ar-aging`,
          icon: Clock,
          roleField: "arAging_view",
        },
        {
          title: "AP Aging",
          url: `/${organizationId}/dashboard/${userId}/reports/ap-aging`,
          icon: Clock,
          roleField: "apAging_view",
        },
        {
          title: "Trial Balance",
          url: `/${organizationId}/dashboard/${userId}/reports/trial-balance`,
          icon: Calculator,
          roleField: "trialBalance_view",
        },
        {
          title: "General Ledger Report",
          url: `/${organizationId}/dashboard/${userId}/reports/general-ledger`,
          icon: BookMarked,
          roleField: "generalLedgerReport_view",
        },
        {
          title: "Tax Summary",
          url: `/${organizationId}/dashboard/${userId}/reports/tax-summary`,
          icon: FileText,
          roleField: "taxSummary_view",
        },
        {
          title: "Audit Reports",
          url: `/${organizationId}/dashboard/${userId}/reports/audit`,
          icon: Shield,
          roleField: "reports_view",
          isNew: true,
        },
      ],
    },
    organization?.modules?.projects && {
      title: "Projects",
      url: "#",
      icon: Briefcase,
      description: "Project management & tracking",
      roleField: "projects_view",
      isNew: true,
      items: [
        {
          title: "All Projects",
          url: `/${organizationId}/dashboard/${userId}/projects/all`,
          icon: Briefcase,
          roleField: "projects_view",
        },
        {
          title: "Time Tracking",
          url: `/${organizationId}/dashboard/${userId}/projects/time`,
          icon: Clock,
          roleField: "projectTime_view",
        },
        {
          title: "Project Budgets",
          url: `/${organizationId}/dashboard/${userId}/projects/budgets`,
          icon: DollarSign,
          roleField: "projectBudgets_view",
        },
        {
          title: "Profitability",
          url: `/${organizationId}/dashboard/${userId}/projects/profitability`,
          icon: TrendingUp,
          roleField: "projectProfitability_view",
        },
      ],
    },
    organization?.modules?.crm && {
      title: "CRM",
      url: "#",
      icon: Target,
      description: "Customer relationship management",
      roleField: "crm_view",
      isNew: true,
      items: [
        {
          title: "Leads",
          url: `/${organizationId}/dashboard/${userId}/crm/leads`,
          icon: Users,
          roleField: "leads_view",
        },
        {
          title: "Opportunities",
          url: `/${organizationId}/dashboard/${userId}/crm/opportunities`,
          icon: TrendingUp,
          roleField: "opportunities_view",
        },
        {
          title: "Sales Pipeline",
          url: `/${organizationId}/dashboard/${userId}/crm/pipeline`,
          icon: BarChart3,
          roleField: "crm_view",
        },
        {
          title: "Contacts",
          url: `/${organizationId}/dashboard/${userId}/crm/contacts`,
          icon: UsersRound,
          roleField: "contacts_view",
        },
      ],
    },
    organization?.modules?.budgeting && {
      title: "Budgeting",
      url: "#",
      icon: Calculator,
      description: "Budget planning & forecasting",
      roleField: "budgeting_view",
      isPro: true,
      items: [
        {
          title: "Annual Budget",
          url: `/${organizationId}/dashboard/${userId}/budgeting/annual`,
          icon: Calendar,
          roleField: "budgets_view",
        },
        {
          title: "Department Budgets",
          url: `/${organizationId}/dashboard/${userId}/budgeting/departments`,
          icon: Building2,
          roleField: "budgets_view",
        },
        {
          title: "Forecasting",
          url: `/${organizationId}/dashboard/${userId}/budgeting/forecasting`,
          icon: TrendingUp,
          roleField: "forecasting_view",
        },
        {
          title: "Budget vs Actual",
          url: `/${organizationId}/dashboard/${userId}/budgeting/variance`,
          icon: BarChart3,
          roleField: "budgets_view",
        },
      ],
    },
    organization?.modules?.assets && {
      title: "Fixed Assets",
      url: "#",
      icon: Building,
      description: "Asset register & depreciation",
      roleField: "assets_view",
      items: [
        {
          title: "All Assets",
          url: `/${organizationId}/dashboard/${userId}/assets/all`,
          icon: Building,
          roleField: "assets_view",
        },
        {
          title: "Depreciation",
          url: `/${organizationId}/dashboard/${userId}/assets/depreciation`,
          icon: TrendingUp,
          roleField: "depreciation_view",
        },
      ],
    },
    organization?.modules?.loans && {
      title: "Loans",
      url: `/${organizationId}/dashboard/${userId}/loans/all`,
      icon: Landmark,
      description: "Loan management & tracking",
      roleField: "loans_view",
    },
    organization?.modules?.equity && {
      title: "Equity",
      url: `/${organizationId}/dashboard/${userId}/equity/all`,
      icon: PiggyBank,
      description: "Owner investments & drawings",
      roleField: "equity_view",
    },
    organization?.modules?.ai && {
      title: "AI Assistant",
      url: "#",
      icon: Lightbulb,
      description: "AI-powered financial tools",
      roleField: "ai_view",
      isNew: true,
      items: [
        {
          title: "AI Chat",
          url: `/${organizationId}/dashboard/${userId}/ai`,
          icon: MessageSquare,
          roleField: "ai_view",
        },
        {
          title: "AI Tools Hub",
          url: `/${organizationId}/dashboard/${userId}/ai/tools`,
          icon: Sparkles,
          roleField: "ai_view",
          isNew: true,
        },
        {
          title: "Financial Insights",
          url: `/${organizationId}/dashboard/${userId}/ai-assistant`,
          icon: Lightbulb,
          roleField: "ai_view",
        },
      ],
    },
    {
      title: "Marketing",
      url: "#",
      icon: Globe,
      description: "Email & SMS campaigns",
      // roleField: "marketing_view",
      items: [
        {
          title: "Email Campaigns",
          url: `/${organizationId}/dashboard/${userId}/marketing/email`,
          icon: Mail,
          // roleField: "emailCampaigns_view",
        },
        {
          title: "SMS Campaigns",
          url: `/${organizationId}/dashboard/${userId}/marketing/sms`,
          icon: MessageSquare,
          // roleField: "smsCampaigns_view",
        },
      ],
    },
    organization?.modules?.settings && {
      title: "Settings",
      url: "#",
      icon: Settings,
      description: "Company & user settings",
      roleField: "settings_view",
      items: [
        {
          title: "Company Profile",
          url: `/${organizationId}/dashboard/${userId}/settings/company`,
          icon: Building2,
          roleField: "companySettings_view",
        },
        {
          title: "Users",
          url: `/${organizationId}/dashboard/${userId}/settings/users`,
          icon: Users,
          roleField: "userManagement_view",
        },
        {
          title: "Roles",
          url: `/${organizationId}/dashboard/${userId}/settings/roles`,
          icon: Users,
          roleField: "userManagement_view",
        },
        {
          title: "Payment Methods",
          url: `/${organizationId}/dashboard/${userId}/settings/payment-methods`,
          icon: CreditCard,
          roleField: "paymentMethods_view",
        },
        {
          title: "Email Templates",
          url: `/${organizationId}/dashboard/${userId}/settings/email-templates`,
          icon: FileText,
          roleField: "emailTemplates_view",
        },
        {
          title: "Integrations",
          url: `/${organizationId}/dashboard/${userId}/settings/integrations`,
          icon: Zap,
          roleField: "integrations_view",
        },
        {
          title: "Audit Logs",
          url: `/${organizationId}/dashboard/${userId}/settings/audit-logs`,
          icon: Shield,
          roleField: "auditLogs_view",
        },
      ],
    },
  ];

  const isActive = useCallback(
    (url: string) => {
      const dashboardPath = `/${organizationId}/dashboard/${userId}`;
      if (pathname === dashboardPath || pathname === `${dashboardPath}/`) {
        return url === pathname;
      }
      return pathname.startsWith(url) && url !== dashboardPath;
    },
    [pathname, organizationId, userId],
  );

  // Memoize filtered navigation items for better performance
  const filteredNavMain = useMemo(() => {
    return navMain
      .filter((item): item is NavItem => item !== false)
      .filter(
        (item) =>
          !item.roleField || (role && role[item.roleField as keyof IRole]),
      )
      .filter((item) => {
        if (!searchQuery) return true;
        const matchesTitle = item.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesDescription = item.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesSubItems = item.items?.some((subItem) =>
          subItem.title.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        return matchesTitle || matchesDescription || matchesSubItems;
      });
  }, [role, searchQuery]);

  // Handle accordion behavior - only one section open at a time
  const handleGroupToggle = useCallback((groupTitle: string) => {
    setOpenGroup((prev) => {
      // If clicking the same group, close it
      if (prev === groupTitle) {
        return null;
      }
      // Otherwise, open the new group (this automatically closes others)
      return groupTitle;
    });
  }, []);

  // Automatically open collapsible if an item inside is active (only on initial load)
  useEffect(() => {
    // Only set initial state if no group is currently open
    if (openGroup === null) {
      const activeGroup = filteredNavMain.find((group) =>
        group.items?.some((item) => isActive(item.url)),
      );
      if (activeGroup) {
        setOpenGroup(activeGroup.title);
      }
    }
  }, [pathname, filteredNavMain, isActive, openGroup]);

  // Clear search when component unmounts or path changes significantly
  useEffect(() => {
    setSearchQuery("");
  }, [organizationId, userId]);

  // Render dropdown menu for collapsed sidebar
  const renderDropdownMenu = (item: NavItem) => {
    const filteredSubItems = item.items?.filter(
      (subItem) =>
        !subItem?.roleField ||
        (role && role[subItem?.roleField as keyof IRole]),
    );

    if (!filteredSubItems || filteredSubItems.length === 0) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={item.description || item.title}
            className={cn(
              "group relative transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground",
              item.items?.some((subItem) => isActive(subItem.url)) &&
                "bg-primary/10 text-primary font-medium border-l-2 border-primary",
              "h-10 px-3 w-full justify-center",
            )}
          >
            {item.icon && (
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  item.isPro && "text-amber-500",
                )}
              />
            )}
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-48">
          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground border-b mb-1">
            {item.title}
          </div>
          {filteredSubItems.map((subItem) => (
            <DropdownMenuItem key={subItem.title} asChild>
              <Link
                href={subItem.url}
                className={cn(
                  "flex items-center gap-3 px-2 py-1.5 text-sm cursor-pointer",
                  isActive(subItem.url) &&
                    "bg-primary/10 text-primary font-medium",
                )}
              >
                {subItem.icon && (
                  <subItem.icon className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="flex-1">{subItem.title}</span>
                {subItem.badge && (
                  <Badge
                    variant={subItem.badgeVariant || "secondary"}
                    className="text-xs px-1.5 py-0 h-4 min-w-4"
                  >
                    {subItem.badge}
                  </Badge>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <SidebarGroup className="scrollbar-hide">
      <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Navigation
      </SidebarGroupLabel>

      {/* Search Input - only show when expanded */}
      {!isCollapsed && (
        <div className="px-2 pb-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
            />
          </div>
        </div>
      )}

      <SidebarMenu className="space-y-1">
        {filteredNavMain.map((item) =>
          item.items ? (
            isCollapsed ? (
              // Render dropdown when collapsed
              <SidebarMenuItem key={item.title}>
                {renderDropdownMenu(item)}
              </SidebarMenuItem>
            ) : (
              // Render collapsible when expanded
              <Collapsible
                key={item.title}
                open={openGroup === item.title}
                onOpenChange={() => handleGroupToggle(item.title)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.description || item.title}
                      className={cn(
                        "group relative transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground",
                        "data-[state=open]:bg-accent/30 data-[state=open]:text-accent-foreground",
                        item.items?.some((subItem) => isActive(subItem.url)) &&
                          "bg-primary/10 text-primary font-medium border-l-2 border-primary",
                        openGroup === item.title &&
                          "bg-accent/30 text-accent-foreground",
                        "h-10 px-3 w-full justify-start",
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {item.icon && (
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0 transition-colors",
                              item.isPro && "text-amber-500",
                            )}
                          />
                        )}
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium">
                              {item.title}
                            </span>
                            {item.isPro && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0 h-4 bg-amber-100 text-amber-700"
                              >
                                PRO
                              </Badge>
                            )}
                            {item.isNew && (
                              <Badge
                                variant="default"
                                className="text-xs px-1.5 py-0 h-4 bg-green-100 text-green-700"
                              >
                                NEW
                              </Badge>
                            )}
                          </div>
                          {item.description && (
                            <span className="text-xs text-muted-foreground truncate">
                              {item.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant || "secondary"}
                            className="text-xs px-1.5 py-0 h-4 min-w-4"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform duration-200",
                            openGroup === item.title && "rotate-90",
                          )}
                        />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="transition-all duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
                    <SidebarMenuSub className="ml-4 border-l border-border/50 pl-4 space-y-1 mt-1">
                      {item.items
                        ?.filter(
                          (subItem) =>
                            !subItem?.roleField ||
                            (role && role[subItem?.roleField as keyof IRole]),
                        )
                        .map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={cn(
                                "group relative transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground",
                                isActive(subItem.url) &&
                                  "bg-primary/10 text-primary font-medium border-l-2 border-primary ml-[-1px]",
                                "h-9 px-3",
                              )}
                            >
                              <Link href={subItem.url}>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {subItem.icon && (
                                    <subItem.icon className="h-3.5 w-3.5 shrink-0" />
                                  )}
                                  <span className="truncate text-sm">
                                    {subItem.title}
                                  </span>
                                </div>
                                {subItem.badge && (
                                  <Badge
                                    variant={
                                      subItem.badgeVariant || "secondary"
                                    }
                                    className="text-xs px-1.5 py-0 h-4 min-w-4 ml-auto"
                                  >
                                    {subItem.badge}
                                  </Badge>
                                )}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.description || item.title}
                className={cn(
                  "group relative transition-all duration-200 hover:bg-accent/50 hover:text-accent-foreground",
                  isActive(item.url) &&
                    "bg-primary text-primary-foreground font-medium shadow-sm",
                  "h-10 px-3",
                  isCollapsed && "justify-center",
                )}
              >
                <Link href={item.url}>
                  <div
                    className={cn(
                      "flex items-center gap-3 flex-1 min-w-0",
                      isCollapsed && "justify-center",
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          item.isPro && "text-amber-500",
                        )}
                      />
                    )}
                    {!isCollapsed && (
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium">
                            {item.title}
                          </span>
                          {item.isPro && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-1.5 py-0 h-4 bg-amber-100 text-amber-700"
                            >
                              PRO
                            </Badge>
                          )}
                          {item.isNew && (
                            <Badge
                              variant="default"
                              className="text-xs px-1.5 py-0 h-4 bg-green-100 text-green-700"
                            >
                              NEW
                            </Badge>
                          )}
                        </div>
                        {item.description && (
                          <span className="text-xs text-muted-foreground truncate">
                            {item.description}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {!isCollapsed && item.badge && (
                    <Badge
                      variant={item.badgeVariant || "secondary"}
                      className="text-xs px-1.5 py-0 h-4 min-w-4 ml-auto"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
