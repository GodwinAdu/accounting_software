"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

export type PayrollHistory = {
  _id: string;
  id: string;
  runNumber: string;
  payPeriod: string;
  payDate: string;
  employees: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: string;
};

export const columns: ColumnDef<PayrollHistory>[] = [
  {
    accessorKey: "runNumber",
    header: "Run #",
    cell: ({ row }) => {
      return <div className="font-mono font-semibold">{row.getValue("runNumber")}</div>;
    },
  },
  {
    accessorKey: "payPeriod",
    header: "Pay Period",
  },
  {
    accessorKey: "payDate",
    header: "Pay Date",
  },
  {
    accessorKey: "employees",
    header: "Employees",
  },
  {
    accessorKey: "grossPay",
    header: "Gross Pay",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("grossPay"));
      return <span>GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "deductions",
    header: "Deductions",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("deductions"));
      return <span className="text-red-600">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "netPay",
    header: "Net Pay",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("netPay"));
      return <span className="font-medium text-emerald-600">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
        processing: { label: "Processing", className: "bg-blue-100 text-blue-700" },
        completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700" },
        cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
