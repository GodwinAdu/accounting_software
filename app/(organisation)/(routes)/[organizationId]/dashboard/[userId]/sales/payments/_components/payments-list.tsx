"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns, Payment } from "./columns";
import Link from "next/link";

interface PaymentsListProps {
  payments: any[];
  hasCreatePermission: boolean;
  organizationId: string;
  userId: string;
}

export function PaymentsList({ payments, hasCreatePermission, organizationId, userId }: PaymentsListProps) {
  const formattedPayments: Payment[] = payments.map((pay) => ({
    _id: pay._id,
    id: pay._id,
    paymentNumber: pay.paymentNumber,
    date: new Date(pay.paymentDate).toLocaleDateString(),
    customer: pay.customerId?.name || "N/A",
    invoice: pay.invoiceId?.invoiceNumber || "N/A",
    amount: pay.amount,
    paymentMethod: pay.paymentMethod,
    reference: pay.reference || "—",
    status: pay.status,
  }));

  const totalReceived = formattedPayments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = formattedPayments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const thisMonth = formattedPayments.filter((p) => new Date(p.date).getMonth() === new Date().getMonth()).reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {totalReceived.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">GHS {pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {thisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedPayments.length}</div>
            <p className="text-xs text-muted-foreground">All payments</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle>Payment Records</CardTitle></div>
          {hasCreatePermission && (
            <Link href={`/${organizationId}/dashboard/${userId}/sales/payments/new`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />Record Payment
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={formattedPayments} searchKey="customer" />
        </CardContent>
      </Card>
    </div>
  );
}
