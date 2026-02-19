"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns, Bill } from "./columns";
import Link from "next/link";

interface BillsListProps {
  bills: any[];
  hasCreatePermission: boolean;
  organizationId: string;
  userId: string;
}

export function BillsList({ bills, hasCreatePermission, organizationId, userId }: BillsListProps) {
  const formattedBills: Bill[] = bills.map((bill) => ({
    _id: bill._id,
    id: bill._id,
    billNumber: bill.billNumber,
    vendor: bill.vendorId?.companyName || "N/A",
    date: new Date(bill.billDate).toLocaleDateString(),
    dueDate: new Date(bill.dueDate).toLocaleDateString(),
    amount: bill.totalAmount,
    balance: bill.totalAmount - (bill.paidAmount || 0),
    status: bill.status,
  }));

  const totalBills = formattedBills.reduce((sum, b) => sum + b.amount, 0);
  const outstanding = formattedBills.reduce((sum, b) => sum + b.balance, 0);
  const overdue = formattedBills
    .filter((b) => b.status === "overdue")
    .reduce((sum, b) => sum + b.balance, 0);
  const paid = formattedBills
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalBills.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All bills</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              GHS {outstanding.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Unpaid balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              GHS {overdue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              GHS {paid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vendor Bills</CardTitle>
          </div>
          {hasCreatePermission && (
            <Link href={`/${organizationId}/dashboard/${userId}/expenses/bills/new`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                New Bill
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={formattedBills}
            searchKey="vendor"
          />
        </CardContent>
      </Card>
    </div>
  );
}
