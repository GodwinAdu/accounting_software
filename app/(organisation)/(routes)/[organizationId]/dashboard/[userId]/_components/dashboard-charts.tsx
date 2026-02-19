"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface DashboardChartsProps {
  recentTransactions: any[];
  payrollRuns: any[];
}

export default function DashboardCharts({ recentTransactions, payrollRuns }: DashboardChartsProps) {
  const payrollData = payrollRuns.map((run) => ({
    month: new Date(run.payPeriodStart).toLocaleDateString("en-US", { month: "short" }),
    amount: run.totalNetPay,
  }));

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <p className="text-sm text-muted-foreground">Chart data coming soon</p>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => {
                  const isIncome = transaction.transactionType === "deposit" || transaction.transactionType === "interest";
                  return (
                    <div key={transaction._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`rounded-full p-2 ${isIncome ? 'bg-emerald-100' : 'bg-red-100'}`}>
                          {isIncome ? (
                            <ArrowUpIcon className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.transactionDate).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isIncome ? '+' : '-'}GHS {transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Analysis</CardTitle>
            <CardDescription>Inflow vs Outflow trends</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Chart data coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payroll Expenses</CardTitle>
            <CardDescription>Monthly payroll trends</CardDescription>
          </CardHeader>
          <CardContent>
            {payrollData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No payroll data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={payrollData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
