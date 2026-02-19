"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type InventoryItem = {
  _id: string;
  sku: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
  costPrice: number;
};

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "name",
    header: "Product",
  },
  {
    accessorKey: "currentStock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("currentStock") as number;
      const reorderLevel = row.original.reorderLevel;
      const status = stock === 0 ? "out_of_stock" : stock <= reorderLevel ? "low_stock" : "in_stock";
      
      return (
        <Badge
          variant={status === "out_of_stock" ? "destructive" : status === "low_stock" ? "secondary" : "default"}
          className={status === "in_stock" ? "bg-emerald-600" : status === "low_stock" ? "bg-yellow-600" : ""}
        >
          {stock}
        </Badge>
      );
    },
  },
  {
    accessorKey: "reorderLevel",
    header: "Reorder Level",
  },
  {
    header: "Value",
    cell: ({ row }) => {
      const stock = row.original.currentStock;
      const cost = row.original.costPrice;
      const value = stock * cost;
      return <span className="font-medium">GHS {value.toLocaleString()}</span>;
    },
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const stock = row.original.currentStock;
      const reorderLevel = row.original.reorderLevel;
      const status = stock === 0 ? "out_of_stock" : stock <= reorderLevel ? "low_stock" : "in_stock";
      
      const labels = {
        in_stock: "In Stock",
        low_stock: "Low Stock",
        out_of_stock: "Out of Stock",
      };
      
      return (
        <Badge
          variant={status === "out_of_stock" ? "destructive" : status === "low_stock" ? "secondary" : "default"}
          className={status === "in_stock" ? "bg-emerald-600" : status === "low_stock" ? "bg-yellow-600" : ""}
        >
          {labels[status]}
        </Badge>
      );
    },
  },
];
