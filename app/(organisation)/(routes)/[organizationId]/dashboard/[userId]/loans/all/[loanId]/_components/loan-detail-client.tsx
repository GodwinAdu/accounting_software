"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, Percent, TrendingDown, Info, ArrowLeft } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { PaymentDialog } from "./payment-dialog";
import { useRouter, useParams } from "next/navigation";

interface LoanDetailClientProps {
  loan: any;
  schedule: any[];
}

export default function LoanDetailClient({ loan, schedule }: LoanDetailClientProps) {
  const router = useRouter();
  const params = useParams();
  const paidMonths = Math.round((loan.totalPrincipalPaid / loan.principalAmount) * loan.loanTerm);
  const remainingMonths = loan.loanTerm - paidMonths;
  const progressPercent = ((loan.principalAmount - loan.outstandingBalance) / loan.principalAmount) * 100;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "month",
      header: "Month",
      cell: ({ row }) => <div className="font-medium">#{row.getValue("month")}</div>,
    },
    {
      accessorKey: "paymentDate",
      header: "Payment Date",
      cell: ({ row }) => new Date(row.getValue("paymentDate")).toLocaleDateString(),
    },
    {
      accessorKey: "payment",
      header: "Payment",
      cell: ({ row }) => <div className="font-semibold">GHS {row.getValue<number>("payment").toLocaleString()}</div>,
    },
    {
      accessorKey: "principal",
      header: "Principal",
      cell: ({ row }) => <div className="text-emerald-600">GHS {row.getValue<number>("principal").toLocaleString()}</div>,
    },
    {
      accessorKey: "interest",
      header: "Interest",
      cell: ({ row }) => <div className="text-orange-600">GHS {row.getValue<number>("interest").toLocaleString()}</div>,
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => <div>GHS {row.getValue<number>("balance").toLocaleString()}</div>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{loan.loanName}</h2>
          <p className="text-muted-foreground">{loan.loanNumber}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {loan.status === "active" && loan.outstandingBalance > 0 && (
            <PaymentDialog 
              loan={loan} 
              organizationId={params.organizationId as string}
              userId={params.userId as string}
            />
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">Loan Amortization</p>
          <p className="text-blue-700">This schedule shows how each payment is split between principal and interest. Early payments have more interest, later payments have more principal.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Principal Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {loan.principalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Original loan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">GHS {loan.outstandingBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{progressPercent.toFixed(1)}% paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {loan.paymentAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{loan.paymentFrequency}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interest Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loan.interestRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Annual rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Loan Details</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Lender: {loan.lender}</p>
            </div>
            <Badge variant={loan.status === "active" ? "default" : loan.status === "paid-off" ? "secondary" : "destructive"}>
              {loan.status.replace("-", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Loan Type</p>
              <p className="font-medium">{loan.loanType.replace("-", " ")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">{new Date(loan.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Maturity Date</p>
              <p className="font-medium">{new Date(loan.maturityDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Loan Term</p>
              <p className="font-medium">{loan.loanTerm} months</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Interest Paid</p>
              <p className="font-medium text-orange-600">GHS {loan.totalInterestPaid.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Principal Paid</p>
              <p className="font-medium text-emerald-600">GHS {loan.totalPrincipalPaid.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payments Made</p>
              <p className="font-medium">{paidMonths} of {loan.loanTerm}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Remaining Payments</p>
              <p className="font-medium">{remainingMonths} months</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amortization Schedule</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Payment breakdown for the life of the loan</p>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={schedule} searchKey="month" />
        </CardContent>
      </Card>
    </div>
  );
}
