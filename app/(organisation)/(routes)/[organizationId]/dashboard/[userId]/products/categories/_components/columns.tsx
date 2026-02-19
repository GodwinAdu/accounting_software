"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteProductCategory } from "@/lib/actions/product-category.action";
import { CellAction } from "@/components/table/cell-action";

export type Category = {
  _id: string;
  name: string;
  description?: string;
  productCount: number;
  status: string;
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return row.original.description || "—";
    },
  },
  {
    accessorKey: "productCount",
    header: "Products",
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue("productCount")} products</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={status === "active" ? "bg-emerald-600" : "bg-gray-500"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
      const params = useParams();
      const pathname = usePathname();

      return (
        <CellAction
          data={category}
          actions={[
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "productCategories_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteProductCategory(
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
