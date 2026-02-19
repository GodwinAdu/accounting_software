"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns, Receipt } from "./columns";
import Link from "next/link";

interface ReceiptsListProps {
  receipts: any[];
  hasCreatePermission: boolean;
  organizationId: string;
  userId: string;
}

export function ReceiptsList({ receipts, hasCreatePermission, organizationId, userId }: ReceiptsListProps) {
  const formattedReceipts: Receipt[] = receipts.map((rec) => ({
    _id: rec._id,
    id: rec._id,
    receiptNumber: rec.receiptNumber,
    date: new Date(rec.receiptDate).toLocaleDateString(),
    customer: rec.customerId?.name || "N/A",
    amount: rec.amount,
    paymentMethod: rec.paymentMethod,
    status: "paid",
  }));

  const totalSales = formattedReceipts.reduce((sum, r) => sum + r.amount, 0);
  const cashSales = formattedReceipts.filter((r) => r.paymentMethod === "cash").reduce((sum, r) => sum + r.amount, 0);
  const thisMonth = formattedReceipts.filter((r) => new Date(r.date).getMonth() === new Date().getMonth()).reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All receipts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">GHS {cashSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Cash payments</p>
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
            <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedReceipts.length}</div>
            <p className="text-xs text-muted-foreground">Active receipts</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle>Sales Receipts</CardTitle></div>
          {hasCreatePermission && (
            <Link href={`/${organizationId}/dashboard/${userId}/sales/receipts/new`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />New Receipt
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={formattedReceipts} searchKey="customer" />
        </CardContent>
      </Card>
    </div>
  );
}
