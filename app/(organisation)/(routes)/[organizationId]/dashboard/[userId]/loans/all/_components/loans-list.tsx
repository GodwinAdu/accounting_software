"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";

interface LoansListProps {
  loans: any[];
  hasCreatePermission: boolean;
}

export function LoansList({ loans, hasCreatePermission }: LoansListProps) {
  const router = useRouter();

  const totalPrincipal = loans.reduce((sum, loan) => sum + loan.principalAmount, 0);
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.outstandingBalance, 0);
  const activeLoans = loans.filter(l => l.status === "active").length;
  const totalPaid = totalPrincipal - totalOutstanding;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loans.length}
            </div>
            <p className="text-xs text-muted-foreground">{activeLoans} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {totalPrincipal.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Original amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              GHS {totalOutstanding.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Amount owed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              GHS {totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Principal repaid</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Loan Register</CardTitle>
          </div>
          {hasCreatePermission && (
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("./all/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Loan
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={loans}
            searchKey="loanName"
          />
        </CardContent>
      </Card>
    </div>
  );
}
