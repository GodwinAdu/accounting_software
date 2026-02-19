"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Transaction = {
  id: string;
  date: string;
  reference: string;
  description: string;
  account: string;
  debit: number;
  credit: number;
  balance: number;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "reference",
    header: "Reference",
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "debit",
    header: "Debit",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("debit"));
      return amount > 0 ? (
        <span className="font-medium text-emerald-600">GHS {amount.toLocaleString()}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "credit",
    header: "Credit",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("credit"));
      return amount > 0 ? (
        <span className="font-medium text-blue-600">GHS {amount.toLocaleString()}</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
];
