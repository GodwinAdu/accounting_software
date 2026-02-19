"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { deleteDeduction } from "@/lib/actions/deduction.action";
import { CellAction } from "@/components/table/cell-action";

export type Deduction = {
  _id: string;
  id: string;
  name: string;
  type: string;
  rate: number;
  isPercentage: boolean;
  status: string;
};

export const columns: ColumnDef<Deduction>[] = [
  {
    accessorKey: "name",
    header: "Deduction Name",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <Badge variant="outline" className="capitalize">{type}</Badge>;
    },
  },
  {
    accessorKey: "rate",
    header: "Rate/Amount",
    cell: ({ row }) => {
      const rate = row.getValue("rate") as number;
      const isPercentage = row.original.isPercentage;
      return <span>{isPercentage ? `${rate}%` : `GHS ${rate}`}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge className={status === "active" ? "bg-emerald-600" : "bg-gray-400"}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deduction = row.original;
      const pathname = usePathname();

      return (
        <CellAction
          data={deduction}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              permissionKey: "deductions_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "deductions_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteDeduction(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
