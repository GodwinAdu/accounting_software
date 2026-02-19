"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TrialBalanceItem = {
  id: string;
  code: string;
  account: string;
  debit: number;
  credit: number;
};

export const columns: ColumnDef<TrialBalanceItem>[] = [
  {
    accessorKey: "code",
    header: "Account Code",
  },
  {
    accessorKey: "account",
    header: "Account Name",
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
