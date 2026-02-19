import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { ArrowUpIcon, CreditCard, DollarSign, TrendingUp, Users, FileText, Receipt, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getDashboardStats } from "@/lib/actions/dashboard.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { SubscriptionWarningBanner } from "@/components/subscription-warning-banner";
import DashboardCharts from "./_components/dashboard-charts";
import DateRangeFilter from "./_components/date-range-filter";
import QuickActions from "./_components/quick-actions";
import UpcomingReminders from "./_components/upcoming-reminders";
import TopCustomersVendors from "./_components/top-customers-vendors";
import AccountHealth from "./_components/account-health";
import ActivityFeed from "./_components/activity-feed";

type Props = Promise<{ organizationId: string; userId: string }>;

const page = async ({ params }: { params: Props }) => {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("dashboard_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const statsResult = await getDashboardStats();
  const stats = statsResult.data || {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    activeEmployees: 0,
    pendingInvoices: { count: 0, amount: 0 },
    unpaidBills: { count: 0, amount: 0 },
    bankBalance: { total: 0, accounts: 0 },
    accountHealth: { totalAssets: 0, totalLiabilities: 0, equity: 0 },
    recentTransactions: [],
    topCustomers: [],
    topVendors: [],
    payrollRuns: [],
  };

  return (
    <div className="space-y-6">
      {/* Subscription Warning Banner */}
      <SubscriptionWarningBanner organizationId={organizationId} userId={userId} />

      {/* Header with Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your business overview.</p>
        </div>
        <DateRangeFilter />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {stats.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-emerald-600">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              <span>12.5% from last month</span>
            </div>
            <Progress value={75} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {stats.totalExpenses.toLocaleString()}</div>
            <div className="flex items-center text-xs text-red-600">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              <span>8.2% from last month</span>
            </div>
            <Progress value={60} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {stats.netProfit.toLocaleString()}</div>
            <div className="flex items-center text-xs text-emerald-600">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              <span>18.7% from last month</span>
            </div>
            <Progress value={85} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEmployees}</div>
            <div className="flex items-center text-xs text-emerald-600">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              <span>3 new this month</span>
            </div>
            <Progress value={90} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <DashboardCharts 
        recentTransactions={stats.recentTransactions}
        payrollRuns={stats.payrollRuns}
      />

      {/* Reminders and Health */}
      <div className="grid gap-4 md:grid-cols-2">
        <UpcomingReminders />
        <AccountHealth accountHealth={stats.accountHealth} />
      </div>

      {/* Top Performers and Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <TopCustomersVendors 
          topCustomers={stats.topCustomers}
          topVendors={stats.topVendors}
        />
        <ActivityFeed />
      </div>

      {/* Quick Actions & Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingInvoices.count}</div>
            <p className="text-xs text-muted-foreground">GHS {stats.pendingInvoices.amount.toLocaleString()} outstanding</p>
            <Badge variant="outline" className="mt-2">Action Required</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Bills</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unpaidBills.count}</div>
            <p className="text-xs text-muted-foreground">GHS {stats.unpaidBills.amount.toLocaleString()} due</p>
            <Badge variant="destructive" className="mt-2">Due Soon</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {stats.bankBalance.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across {stats.bankBalance.accounts} accounts</p>
            <Badge variant="secondary" className="mt-2 bg-emerald-100 text-emerald-700">Healthy</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
