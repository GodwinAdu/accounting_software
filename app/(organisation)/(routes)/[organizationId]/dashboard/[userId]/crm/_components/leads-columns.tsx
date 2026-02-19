"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { deleteLead } from "@/lib/actions/lead.action";
import { CellAction } from "@/components/table/cell-action";

export type Lead = {
  _id: string;
  leadNumber: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: string;
  value: number;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    qualified: "bg-green-100 text-green-700",
    unqualified: "bg-red-100 text-red-700",
    converted: "bg-purple-100 text-purple-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "leadNumber",
    header: "Lead #",
    cell: ({ row }) => <div className="font-medium">{row.getValue("leadNumber")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => <div>{row.getValue("company") || "—"}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("phone") || "—"}</div>,
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => <div className="capitalize">{row.getValue("source")}</div>,
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => <div>GHS {row.getValue<number>("value").toLocaleString()}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <Badge className={getStatusColor(status)}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const lead = row.original;
      const pathname = usePathname();

      return (
        <CellAction
          data={lead}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              permissionKey: "leads_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "leads_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteLead(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
