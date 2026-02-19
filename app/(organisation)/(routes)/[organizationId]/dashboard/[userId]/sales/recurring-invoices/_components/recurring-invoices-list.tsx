"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns, RecurringInvoice } from "./columns";
import Link from "next/link";

interface RecurringInvoicesListProps {
  recurringInvoices: any[];
  hasCreatePermission: boolean;
  organizationId: string;
  userId: string;
}

export function RecurringInvoicesList({ recurringInvoices, hasCreatePermission, organizationId, userId }: RecurringInvoicesListProps) {
  const formattedInvoices: RecurringInvoice[] = recurringInvoices.map((inv) => ({
    _id: inv._id,
    id: inv._id,
    profileName: inv.profileName,
    customer: inv.customerId?.name || "N/A",
    amount: inv.totalAmount,
    frequency: inv.frequency,
    startDate: new Date(inv.startDate).toLocaleDateString(),
    nextInvoice: new Date(inv.nextDate).toLocaleDateString(),
    status: inv.status,
    invoicesGenerated: 0,
  }));

  const activeProfiles = formattedInvoices.filter((r) => r.status === "active").length;
  const monthlyRevenue = formattedInvoices.filter((r) => r.status === "active" && r.frequency === "monthly").reduce((sum, r) => sum + r.amount, 0);
  const totalGenerated = formattedInvoices.reduce((sum, r) => sum + r.invoicesGenerated, 0);
  const projectedAnnual = formattedInvoices.filter((r) => r.status === "active").reduce((sum, r) => {
    const multiplier = { daily: 365, weekly: 52, monthly: 12, quarterly: 4, yearly: 1 }[r.frequency];
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
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From monthly profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Annual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">GHS {projectedAnnual.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Expected yearly revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGenerated}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle>Recurring Invoice Profiles</CardTitle></div>
          {hasCreatePermission && (
            <Link href={`/${organizationId}/dashboard/${userId}/sales/recurring-invoices/new`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />New Profile
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={formattedInvoices} searchKey="customer" />
        </CardContent>
      </Card>
    </div>
  );
}
