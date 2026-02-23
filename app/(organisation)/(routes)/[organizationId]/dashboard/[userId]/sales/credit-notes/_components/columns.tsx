"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteCreditNote } from "@/lib/actions/credit-note.action";
import { CellAction } from "@/components/table/cell-action";

export type CreditNote = {
  _id: string;
  creditNoteNumber: string;
  date: string;
  customer: string;
  reason?: string;
  total: number;
  status: "draft" | "issued" | "applied";
};

export const columns: ColumnDef<CreditNote>[] = [
  { 
    accessorKey: "creditNoteNumber", 
    header: "Credit Note #", 
    cell: ({ row }) => <div className="font-mono font-semibold">{row.getValue("creditNoteNumber")}</div> 
  },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "customer", header: "Customer" },
  { 
    accessorKey: "reason", 
    header: "Reason",
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("reason") || "-"}</div>
  },
  { 
    accessorKey: "total", 
    header: "Amount", 
    cell: ({ row }) => <div className="font-semibold text-red-600">-GHS {row.getValue<number>("total").toLocaleString()}</div> 
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
        issued: { label: "Issued", className: "bg-blue-100 text-blue-700" },
        applied: { label: "Applied", className: "bg-emerald-100 text-emerald-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const creditNote = row.original;
      const params = useParams();
      const pathname = usePathname();

      return (
        <CellAction
          data={creditNote}
          actions={[
            { 
              label: "Edit", 
              type: "edit", 
              icon: <Edit className="h-4 w-4" />, 
              permissionKey: "creditNotes_update",
              href: `/${params.organizationId}/dashboard/${params.userId}/sales/credit-notes/${creditNote._id}/edit`
            },
            { 
              label: "Delete", 
              type: "delete", 
              icon: <Trash2 className="h-4 w-4" />, 
              permissionKey: "creditNotes_delete" 
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteCreditNote(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
