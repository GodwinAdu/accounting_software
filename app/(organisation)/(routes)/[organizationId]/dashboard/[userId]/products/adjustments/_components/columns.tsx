"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

export type Adjustment = {
  _id: string;
  createdAt: string;
  productId: { name: string; sku: string };
  type: string;
  quantity: number;
  reason: string;
  createdBy: { firstName: string; lastName: string };
};

export const columns: ColumnDef<Adjustment>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },
  {
    header: "Product",
    cell: ({ row }) => {
      const product = row.original.productId;
      return product ? `${product.name} (${product.sku})` : "—";
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge variant={type === "increase" ? "default" : "destructive"} className={type === "increase" ? "bg-emerald-600" : ""}>
          {type === "increase" ? (
            <>
              <ArrowUp className="h-3 w-3 mr-1" />
              Increase
            </>
          ) : (
            <>
              <ArrowDown className="h-3 w-3 mr-1" />
              Decrease
            </>
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const type = row.original.type;
      const quantity = row.getValue("quantity") as number;
      return (
        <span className={`font-medium ${type === "increase" ? "text-emerald-600" : "text-red-600"}`}>
          {type === "increase" ? "+" : "-"}{quantity}
        </span>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    header: "Adjusted By",
    cell: ({ row }) => {
      const user = row.original.createdBy;
      return user ? `${user.firstName} ${user.lastName}` : "—";
    },
  },
];
