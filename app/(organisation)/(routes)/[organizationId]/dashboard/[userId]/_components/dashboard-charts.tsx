"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 35000 },
  { month: "Mar", revenue: 48000, expenses: 33000 },
  { month: "Apr", revenue: 61000, expenses: 38000 },
  { month: "May", revenue: 55000, expenses: 36000 },
  { month: "Jun", revenue: 67000, expenses: 42000 },
];

const cashFlowData = [
  { month: "Jan", inflow: 45000, outflow: 32000 },
  { month: "Feb", inflow: 52000, outflow: 35000 },
  { month: "Mar", inflow: 48000, outflow: 33000 },
  { month: "Apr", inflow: 61000, outflow: 38000 },
  { month: "May", inflow: 55000, outflow: 36000 },
  { month: "Jun", inflow: 67000, outflow: 42000 },
];

const payrollData = [
  { month: "Jan", amount: 28000 },
  { month: "Feb", amount: 29500 },
  { month: "Mar", amount: 28500 },
  { month: "Apr", amount: 31000 },
  { month: "May", amount: 30000 },
  { month: "Jun", amount: 32000 },
];

const recentTransactions = [
  { id: 1, description: "Client Payment - ABC Corp", amount: 15000, type: "income", date: "2024-01-15" },
  { id: 2, description: "Office Rent", amount: -5000, type: "expense", date: "2024-01-14" },
  { id: 3, description: "Payroll Processing", amount: -32000, type: "expense", date: "2024-01-13" },
  { id: 4, description: "Consulting Services", amount: 8500, type: "income", date: "2024-01-12" },
  { id: 5, description: "Software Subscription", amount: -450, type: "expense", date: "2024-01-11" },
];

export default function DashboardCharts() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly comparison for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-full p-2 ${transaction.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpIcon className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : ''}GHS {Math.abs(transaction.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
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
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="inflow" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="outflow" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payroll Expenses</CardTitle>
            <CardDescription>Monthly payroll trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={payrollData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
