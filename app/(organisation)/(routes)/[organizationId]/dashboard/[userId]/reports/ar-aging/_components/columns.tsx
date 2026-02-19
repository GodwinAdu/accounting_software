"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ARAgingItem = {
  id: string;
  customer: string;
  current: number;
  days30: number;
  days60: number;
  days90: number;
  over90: number;
  total: number;
};

export const columns: ColumnDef<ARAgingItem>[] = [
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "current",
    header: "Current",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("current"));
      return <span className="font-medium text-emerald-600">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "days30",
    header: "1-30 Days",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("days30"));
      return amount > 0 ? <span className="font-medium text-blue-600">GHS {amount.toLocaleString()}</span> : <span className="text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: "days60",
    header: "31-60 Days",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("days60"));
      return amount > 0 ? <span className="font-medium text-yellow-600">GHS {amount.toLocaleString()}</span> : <span className="text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: "days90",
    header: "61-90 Days",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("days90"));
      return amount > 0 ? <span className="font-medium text-orange-600">GHS {amount.toLocaleString()}</span> : <span className="text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: "over90",
    header: "Over 90 Days",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("over90"));
      return amount > 0 ? <span className="font-medium text-red-600">GHS {amount.toLocaleString()}</span> : <span className="text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      return <span className="font-bold">GHS {amount.toLocaleString()}</span>;
    },
  },
];
