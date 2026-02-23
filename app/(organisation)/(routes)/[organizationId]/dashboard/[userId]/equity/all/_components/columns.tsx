"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { deleteEquityTransaction } from "@/lib/actions/equity-transaction.action";
import { CellAction } from "@/components/table/cell-action";

export type EquityTransaction = {
  _id: string;
  transactionNumber: string;
  transactionType: "investment" | "drawing" | "dividend";
  transactionDate: Date;
  amount: number;
  ownerName: string;
  description: string;
};

export const columns: ColumnDef<EquityTransaction>[] = [
  {
    accessorKey: "transactionNumber",
    header: "Transaction #",
    cell: ({ row }) => {
      return <div className="font-mono font-semibold">{row.getValue("transactionNumber")}</div>;
    },
  },
  {
    accessorKey: "transactionDate",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("transactionDate")).toLocaleDateString();
    },
  },
  {
    accessorKey: "transactionType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("transactionType") as string;
      const typeConfig = {
        investment: { label: "Investment", className: "bg-emerald-100 text-emerald-700" },
        drawing: { label: "Drawing", className: "bg-red-100 text-red-700" },
        dividend: { label: "Dividend", className: "bg-blue-100 text-blue-700" },
      };
      const config = typeConfig[type as keyof typeof typeConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const type = row.original.transactionType;
      const amount = row.getValue<number>("amount");
      const isPositive = type === "investment";
      return (
        <div className={`font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
          {isPositive ? "+" : "-"}GHS {amount.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return <div className="max-w-[300px] truncate">{row.getValue("description")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;
      const pathname = usePathname();

      return (
        <CellAction
          data={transaction}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              href: `${pathname}/${transaction._id}`,
              permissionKey: "equity_edit",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "equity_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteEquityTransaction(id);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
