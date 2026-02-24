"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Package, Layers } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteProduct } from "@/lib/actions/product.action";
import { CellAction } from "@/components/table/cell-action";

export type Product = {
  _id: string;
  sku: string;
  name: string;
  categoryId?: { name: string };
  type: "product" | "service" | "bundle";
  sellingPrice: number;
  costPrice: number;
  currentStock: number;
  reorderLevel: number;
  status: string;
  hasVariants?: boolean;
  variants?: any[];
  bundleItems?: any[];
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => {
      const hasVariants = row.original.hasVariants;
      const isBundle = row.original.type === "bundle";
      return (
        <div className="flex items-center gap-2">
          <span>{row.getValue("name")}</span>
          {hasVariants && (
            <Badge variant="outline" className="text-xs">
              <Layers className="h-3 w-3 mr-1" />
              {row.original.variants?.length || 0} variants
            </Badge>
          )}
          {isBundle && (
            <Badge variant="outline" className="text-xs">
              <Package className="h-3 w-3 mr-1" />
              Bundle
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "categoryId.name",
    header: "Category",
    cell: ({ row }) => {
      return row.original.categoryId?.name || "Uncategorized";
    },
  },
  {
    accessorKey: "sellingPrice",
    header: "Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("sellingPrice"));
      return <span className="font-medium">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "costPrice",
    header: "Cost",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("costPrice"));
      return <span className="font-medium text-muted-foreground">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "currentStock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("currentStock") as number;
      const reorderLevel = row.original.reorderLevel;
      return (
        <Badge 
          variant={stock <= reorderLevel ? "destructive" : "default"} 
          className={stock > reorderLevel ? "bg-emerald-600" : ""}
        >
          {stock}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge 
          className={
            status === "active" 
              ? "bg-emerald-600" 
              : status === "inactive" 
              ? "bg-gray-500" 
              : "bg-red-600"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const params = useParams();
      const pathname = usePathname();

      return (
        <CellAction
          data={product}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              href: `${pathname}/${product._id}`,
              permissionKey: "products_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "products_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteProduct(
              id,
              pathname
            );
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
