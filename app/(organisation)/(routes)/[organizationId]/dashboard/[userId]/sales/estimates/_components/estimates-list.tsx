"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { columns, type Estimate } from "./columns";
import Link from "next/link";

const mockEstimates: Estimate[] = [
  { id: "1", estimateNumber: "EST-001", customer: "ABC Corporation", date: "2024-01-15", expiryDate: "2024-02-14", amount: 45000, status: "sent" },
  { id: "2", estimateNumber: "EST-002", customer: "XYZ Limited", date: "2024-01-10", expiryDate: "2024-02-09", amount: 32000, status: "accepted" },
  { id: "3", estimateNumber: "EST-003", customer: "Tech Solutions", date: "2023-12-20", expiryDate: "2024-01-19", amount: 28000, status: "expired" },
  { id: "4", estimateNumber: "EST-004", customer: "Global Traders", date: "2024-01-12", expiryDate: "2024-02-11", amount: 18500, status: "draft" },
];

interface EstimatesListProps {
  organizationId: string;
  userId: string;
}

export default function EstimatesList({ organizationId, userId }: EstimatesListProps) {
  const [estimates] = useState(mockEstimates);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estimates.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{estimates.filter(e => e.status === "accepted").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Converted to invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estimates.filter(e => e.status === "sent").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declined</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estimates.filter(e => e.status === "declined").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Not accepted</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Estimates</CardTitle>
            <Link href={`/${organizationId}/dashboard/${userId}/sales/estimates/new`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Estimate
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={estimates} searchKey="customer" filterGroups={[{ id: "status", label: "Status", options: [{ _id: "draft", label: "Draft" }, { _id: "sent", label: "Sent" }, { _id: "accepted", label: "Accepted" }, { _id: "declined", label: "Declined" }, { _id: "expired", label: "Expired" }] }]} />
        </CardContent>
      </Card>
    </div>
  );
}
