"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, CreditCard, DollarSign, TrendingUp, Users, FileText, Receipt, Wallet, Sparkles, Zap, Brain } from "lucide-react";
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
import { DateRange } from "react-day-picker";
import { getDashboardStats } from "@/lib/actions/dashboard.action";

export default function DashboardClient({ initialStats }: { initialStats: any }) {
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

      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-purple-600 hover:bg-purple-700">AI-Powered</Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Advanced AI Features Available</h3>
              <p className="text-gray-600 max-w-2xl">
                Supercharge your accounting workflow with AI-powered tools. Get instant insights, automate data entry, 
                detect anomalies, and make smarter financial decisions faster than ever.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span>Invoice OCR Extraction</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span>Smart Categorization</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span>Predictive Analytics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span>Financial Insights</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Link href={`/${params.organizationId}/dashboard/${params.userId}/ai`}>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Try AI Chat
                  </Button>
                </Link>
                <Link href={`/${params.organizationId}/dashboard/${params.userId}/ai/tools`}>
                  <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                    <Zap className="h-4 w-4 mr-2" />
                    Explore AI Tools
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative p-8 bg-white rounded-2xl shadow-lg">
                  <Brain className="h-20 w-20 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
