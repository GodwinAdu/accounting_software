"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";

export function LoansClient({ loans }: { loans: any[] }) {
  const activeLoans = loans.filter(l => l.status === "active").length;
  const totalDisbursed = loans.filter(l => l.status !== "rejected").reduce((sum, l) => sum + l.amount, 0);
  const totalRepaid = loans.reduce((sum, l) => sum + l.totalRepaid, 0);
  const totalOutstanding = loans.filter(l => l.status === "active").reduce((sum, l) => sum + l.outstandingBalance, 0);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans}</div>
            <p className="text-xs text-muted-foreground mt-1">Outstanding loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalDisbursed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repaid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {totalRepaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">GHS {totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">To be repaid</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={loans} searchKey="employeeId.userId.fullName" />
        </CardContent>
      </Card>
    </>
  );
}
