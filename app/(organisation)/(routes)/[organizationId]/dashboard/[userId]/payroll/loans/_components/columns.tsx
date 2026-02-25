"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { LoanActions } from "./loan-actions";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee",
    cell: ({ row }) => {
      const employee = row.original.employeeId;
      return (
        <div>
          <p className="font-medium">{employee?.userId?.fullName || "N/A"}</p>
          <p className="text-sm text-muted-foreground">{employee?.employeeNumber}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `GHS ${row.original.amount.toLocaleString()}`,
  },
  {
    accessorKey: "repaymentMonths",
    header: "Term",
    cell: ({ row }) => `${row.original.repaymentMonths} months`,
  },
  {
    accessorKey: "monthlyDeduction",
    header: "Monthly",
    cell: ({ row }) => `GHS ${row.original.monthlyDeduction.toFixed(2)}`,
  },
  {
    accessorKey: "outstandingBalance",
    header: "Outstanding",
    cell: ({ row }) => `GHS ${row.original.outstandingBalance.toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const config: any = {
        pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
        approved: { label: "Approved", className: "bg-blue-100 text-blue-700" },
        active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
        rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
        completed: { label: "Completed", className: "bg-gray-100 text-gray-700" },
      };
      return <Badge className={config[status]?.className}>{config[status]?.label}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Requested",
    cell: ({ row }) => format(new Date(row.original.createdAt), "MMM dd, yyyy"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <LoanActions loan={row.original} />,
  },
];
