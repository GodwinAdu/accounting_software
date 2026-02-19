"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, CheckCircle2, Clock } from "lucide-react";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "transactionDate",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("transactionDate")).toLocaleDateString("en-GB");
    },
  },
  {
    accessorKey: "transactionNumber",
    header: "Transaction #",
    cell: ({ row }) => {
      return <span className="font-mono text-sm">{row.getValue("transactionNumber")}</span>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const transaction = row.original;
      const isIncome = transaction.transactionType === "deposit" || transaction.transactionType === "interest";
      return (
        <div className="flex items-center gap-2">
          <div className={`rounded-full p-1 ${
            isIncome ? "bg-emerald-100" : "bg-red-100"
          }`}>
            {isIncome ? (
              <ArrowUpIcon className="h-3 w-3 text-emerald-600" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-red-600" />
            )}
          </div>
          <div>
            <p className="font-medium">{transaction.description}</p>
            {transaction.payee && <p className="text-xs text-muted-foreground">{transaction.payee}</p>}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "transactionType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("transactionType") as string;
      const labels: any = {
        deposit: "Deposit",
        withdrawal: "Withdrawal",
        transfer: "Transfer",
        fee: "Fee",
        interest: "Interest",
        other: "Other",
      };
      return <Badge variant="outline">{labels[type] || type}</Badge>;
    },
  },
  {
    accessorKey: "bankAccountId",
    header: "Account",
    cell: ({ row }) => {
      const account = row.original.bankAccountId;
      return account ? `${account.bankName} - ${account.accountName}` : "—";
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const transaction = row.original;
      const isIncome = transaction.transactionType === "deposit" || transaction.transactionType === "interest";
      return (
        <div className={`font-semibold ${
          isIncome ? "text-emerald-600" : "text-red-600"
        }`}>
          {isIncome ? "+" : "-"}GHS {transaction.amount.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "isReconciled",
    header: "Status",
    cell: ({ row }) => {
      const isReconciled = row.getValue("isReconciled");
      return isReconciled ? (
        <Badge className="bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Reconciled
        </Badge>
      ) : (
        <Badge variant="outline">
          <Clock className="h-3 w-3 mr-1" />
          Unreconciled
        </Badge>
      );
    },
  },
];
