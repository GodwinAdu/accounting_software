"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns, RecurringExpense } from "./columns";
import Link from "next/link";

interface RecurringExpensesListProps {
  recurringExpenses: any[];
  hasCreatePermission: boolean;
  organizationId: string;
  userId: string;
}

export function RecurringExpensesList({ recurringExpenses, hasCreatePermission, organizationId, userId }: RecurringExpensesListProps) {
  const formattedExpenses: RecurringExpense[] = recurringExpenses.map((exp) => ({
    _id: exp._id,
    id: exp._id,
    profileName: exp.description,
    vendor: exp.vendorId?.companyName || "N/A",
    category: exp.categoryId?.name || "N/A",
    amount: exp.amount,
    frequency: exp.frequency,
    nextDate: new Date(exp.nextDate).toLocaleDateString(),
    status: exp.status,
    expensesGenerated: 0,
  }));

  const activeProfiles = formattedExpenses.filter((r) => r.status === "active").length;
  const monthlyExpenses = formattedExpenses
    .filter((r) => r.status === "active" && r.frequency === "monthly")
    .reduce((sum, r) => sum + r.amount, 0);
  const totalGenerated = formattedExpenses.reduce((sum, r) => sum + r.expensesGenerated, 0);
  const projectedAnnual = formattedExpenses
    .filter((r) => r.status === "active")
    .reduce((sum, r) => {
      const multiplier = {
        daily: 365,
        weekly: 52,
        monthly: 12,
        quarterly: 4,
        yearly: 1,
      }[r.frequency];
      return sum + r.amount * multiplier;
    }, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{activeProfiles}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              GHS {monthlyExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">From monthly profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Annual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              GHS {projectedAnnual.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Expected yearly cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGenerated}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recurring Expense Profiles</CardTitle>
          </div>
          {hasCreatePermission && (
            <Link href={`/${organizationId}/dashboard/${userId}/expenses/recurring/new`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                New Profile
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={formattedExpenses}
            searchKey="profileName"
          />
        </CardContent>
      </Card>
    </div>
  );
}
