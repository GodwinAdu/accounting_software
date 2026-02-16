"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export type Transaction = {
  id: string;
  date: string;
  description: string;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  category: string;
  account: string;
  status: string;
  reference: string;
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-1 ${
            transaction.type === "credit" ? "bg-emerald-100" : "bg-red-100"
          }`}>
            {transaction.type === "credit" ? (
              <ArrowUpIcon className="h-3 w-3 text-emerald-600" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-red-600" />
            )}
          </div>
          <div>
            <p className="font-medium">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">{transaction.reference}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue("category")}</Badge>;
    },
  },
  {
    accessorKey: "account",
    header: "Account",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <div className={`font-semibold ${
          transaction.type === "credit" ? "text-emerald-600" : "text-red-600"
        }`}>
          {transaction.type === "credit" ? "+" : "-"}GHS {transaction.amount.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      return <div>GHS {row.getValue<number>("balance").toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "completed" ? "secondary" : "outline"}
          className={status === "completed" ? "bg-emerald-100 text-emerald-700" : ""}
        >
          {status}
        </Badge>
      );
    },
  },
];
