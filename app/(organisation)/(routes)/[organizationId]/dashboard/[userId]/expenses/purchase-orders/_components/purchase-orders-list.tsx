"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns, PurchaseOrder } from "./columns";
import Link from "next/link";

interface PurchaseOrdersListProps {
  purchaseOrders: any[];
  hasCreatePermission: boolean;
  organizationId: string;
  userId: string;
}

export function PurchaseOrdersList({ purchaseOrders, hasCreatePermission, organizationId, userId }: PurchaseOrdersListProps) {
  const formattedPOs: PurchaseOrder[] = purchaseOrders.map((po) => ({
    _id: po._id,
    id: po._id,
    poNumber: po.poNumber,
    vendor: po.vendorId?.companyName || "N/A",
    date: new Date(po.orderDate).toLocaleDateString(),
    expectedDate: new Date(po.expectedDeliveryDate).toLocaleDateString(),
    amount: po.totalAmount,
    status: po.status,
  }));

  const totalOrders = formattedPOs.length;
  const totalAmount = formattedPOs.reduce((sum, po) => sum + po.amount, 0);
  const pending = formattedPOs.filter((po) => po.status === "sent" || po.status === "approved").length;
  const received = formattedPOs.filter((po) => po.status === "received").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">All purchase orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{received}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Purchase Orders</CardTitle>
          </div>
          {hasCreatePermission && (
            <Link href={`/${organizationId}/dashboard/${userId}/expenses/purchase-orders/new`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                New Purchase Order
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={formattedPOs}
            searchKey="vendor"
          />
        </CardContent>
      </Card>
    </div>
  );
}
