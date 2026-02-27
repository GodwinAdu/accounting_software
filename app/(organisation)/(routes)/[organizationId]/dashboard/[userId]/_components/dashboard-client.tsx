"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, CreditCard, DollarSign, TrendingUp, Users, FileText, Receipt, Wallet, Sparkles, Zap, Brain, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import DateRangeFilter from "./date-range-filter";
import DashboardCharts from "./dashboard-charts";
import QuickActions from "./quick-actions";
import UpcomingReminders from "./upcoming-reminders";
import TopCustomersVendors from "./top-customers-vendors";
import AccountHealth from "./account-health";
import ActivityFeed from "./activity-feed";
import { TaxWidget } from "@/components/dashboard/tax-widget";
import { DateRange } from "react-day-picker";
import { getDashboardStats } from "@/lib/actions/dashboard.action";
import { FinancialInsights } from "@/components/ai";

export default function DashboardClient({ initialStats, hasAIAccess }: { initialStats: any, hasAiAccess: boolean }) {
  const [stats, setStats] = useState(initialStats);
  const [isPending, startTransition] = useTransition();
  const params = useParams();

  const handleDateChange = async (dateRange: DateRange | undefined) => {
    if (!dateRange?.from || !dateRange?.to) return;

    startTransition(async () => {
      const result = await getDashboardStats(dateRange.from, dateRange.to);
      if (result.data) setStats(result.data);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your business overview.</p>
        </div>
        <DateRangeFilter onDateChange={handleDateChange} />
      </div>


      <div className="grid gap-4">
        {hasAIAccess ? (
          <FinancialInsights />
        ) : (
          <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="h-5 w-5 text-purple-600" />
                Advanced AI Features Available
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Unlock AI-powered insights and automation across all modules including:
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Financial insights and recommendations
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  AI-generated emails for invoices and campaigns
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Smart expense categorization
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Automated reconciliation and anomaly detection
                </li>
              </ul>
              <Link href={`/${params?.organizationId}/dashboard/${params?.userId}/settings/company?tab=subscription`}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Activate AI Module
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/*  */}

      <QuickActions />

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

      <DashboardCharts
        recentTransactions={stats.recentTransactions}
        payrollRuns={stats.payrollRuns}
        monthlyRevenueExpenses={stats.monthlyRevenueExpenses || []}
        cashFlowData={stats.cashFlowData || []}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <UpcomingReminders />
        <AccountHealth accountHealth={stats.accountHealth} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TopCustomersVendors
          topCustomers={stats.topCustomers}
          topVendors={stats.topVendors}
        />
        <ActivityFeed />
      </div>

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

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-1">
          <TaxWidget
            vatPayable={stats.vatData?.outputVAT || 0}
            vatReceivable={stats.vatData?.inputVAT || 0}
            netVAT={stats.vatData?.netVAT || 0}
            organizationId={params.organizationId as string}
            userId={params.userId as string}
          />
        </div>
      </div>
    </div>
  );
}
