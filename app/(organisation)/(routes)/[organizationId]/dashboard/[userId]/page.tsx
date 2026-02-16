import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { ArrowUpIcon, CreditCard, DollarSign, TrendingUp, Users, FileText, Receipt, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardCharts from "./_components/dashboard-charts";
import DateRangeFilter from "./_components/date-range-filter";
import QuickActions from "./_components/quick-actions";
import UpcomingReminders from "./_components/upcoming-reminders";
import TopCustomersVendors from "./_components/top-customers-vendors";
import AccountHealth from "./_components/account-health";
import ActivityFeed from "./_components/activity-feed";

type Props = Promise<{ organizationId: string; userId: string }>;

const page = async ({ params }: { params: Props }) => {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { organizationId, userId } = await params;

  return (
    <div className="space-y-6">
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
            <div className="text-2xl font-bold">GHS 328,000</div>
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
            <div className="text-2xl font-bold">GHS 216,000</div>
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
            <div className="text-2xl font-bold">GHS 112,000</div>
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
            <div className="text-2xl font-bold">48</div>
            <div className="flex items-center text-xs text-emerald-600">
              <ArrowUpIcon className="mr-1 h-3 w-3" />
              <span>3 new this month</span>
            </div>
            <Progress value={90} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <DashboardCharts />

      {/* Reminders and Health */}
      <div className="grid gap-4 md:grid-cols-2">
        <UpcomingReminders />
        <AccountHealth />
      </div>

      {/* Top Performers and Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <TopCustomersVendors />
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">GHS 45,000 outstanding</p>
            <Badge variant="outline" className="mt-2">Action Required</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Bills</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">GHS 23,500 due</p>
            <Badge variant="destructive" className="mt-2">Due Soon</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS 156,000</div>
            <p className="text-xs text-muted-foreground">Across 3 accounts</p>
            <Badge variant="secondary" className="mt-2 bg-emerald-100 text-emerald-700">Healthy</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
