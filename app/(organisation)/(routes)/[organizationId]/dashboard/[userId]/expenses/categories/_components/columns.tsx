"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteExpenseCategory } from "@/lib/actions/expense-category.action";
import { CellAction } from "@/components/table/cell-action";

export type Category = {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Category Name",
    cell: ({ row }) => {
      return <div className="font-semibold">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return row.original.description || "—";
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
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              href: `${pathname}/${category._id}`,
              permissionKey: "expenseCategories_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "expenseCategories_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteExpenseCategory(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
