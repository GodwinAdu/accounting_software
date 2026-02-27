"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export type Transaction = {
  id: string;
  date: string;
  reference: string;
  description: string;
  account: string;
  debit: number;
  credit: number;
  balance: number;
  createdBy?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt?: string;
};

export const createColumns = (onViewDetails: (transaction: Transaction) => void): ColumnDef<Transaction>[] => [
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
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));
      return <span className="font-medium">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(row.original)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      );
    },
  },
];
