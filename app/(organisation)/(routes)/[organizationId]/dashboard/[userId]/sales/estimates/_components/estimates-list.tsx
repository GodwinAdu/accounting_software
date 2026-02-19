"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { columns, type Estimate } from "./columns";
import Link from "next/link";

interface EstimatesListProps {
  estimates: any[];
  hasCreatePermission: boolean;
  organizationId: string;
  userId: string;
}

export default function EstimatesList({ estimates, hasCreatePermission, organizationId, userId }: EstimatesListProps) {
  const formattedEstimates: Estimate[] = estimates.map((est) => ({
    _id: est._id,
    id: est._id,
    estimateNumber: est.estimateNumber,
    customer: est.customerId?.name || "N/A",
    date: new Date(est.estimateDate).toLocaleDateString(),
    expiryDate: new Date(est.expiryDate).toLocaleDateString(),
    amount: est.totalAmount,
    status: est.status,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedEstimates.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formattedEstimates.filter(e => e.status === "accepted").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Converted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formattedEstimates.filter(e => e.status === "sent").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formattedEstimates.filter(e => e.status === "declined").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Not accepted</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Estimates</CardTitle>
            {hasCreatePermission && (
              <Link href={`/${organizationId}/dashboard/${userId}/sales/estimates/new`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Estimate
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={formattedEstimates} searchKey="customer" filterGroups={[{ id: "status", label: "Status", options: [{ _id: "draft", label: "Draft" }, { _id: "sent", label: "Sent" }, { _id: "accepted", label: "Accepted" }, { _id: "declined", label: "Declined" }, { _id: "expired", label: "Expired" }] }]} />
        </CardContent>
      </Card>
    </div>
  );
}
