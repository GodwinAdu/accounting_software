"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteEstimate } from "@/lib/actions/estimate.action";
import { CellAction } from "@/components/table/cell-action";

export type Estimate = {
  _id: string;
  id: string;
  estimateNumber: string;
  customer: string;
  date: string;
  expiryDate: string;
  amount: number;
  status: "draft" | "sent" | "accepted" | "declined" | "expired";
};

export const columns: ColumnDef<Estimate>[] = [
  { accessorKey: "estimateNumber", header: "Estimate #", cell: ({ row }) => <div className="font-mono font-semibold">{row.getValue("estimateNumber")}</div> },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "expiryDate", header: "Expiry Date" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <div className="font-semibold">GHS {row.getValue<number>("amount").toLocaleString()}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const config: Record<string, string> = {
        draft: "bg-gray-100 text-gray-700",
        sent: "bg-blue-100 text-blue-700",
        accepted: "bg-emerald-100 text-emerald-700",
        declined: "bg-red-100 text-red-700",
        expired: "bg-orange-100 text-orange-700",
      };
      return <Badge className={config[status]}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const estimate = row.original;
      const params = useParams();
      const pathname = usePathname();
      const segments = pathname.split('/');
      const orgId = segments[1];
      const userId = segments[3];

      return (
        <CellAction
          data={estimate}
          actions={[
            { label: "Edit", type: "edit", icon: <Edit className="h-4 w-4" />, permissionKey: "estimates_update", href: `/${orgId}/dashboard/${userId}/sales/estimates/${estimate._id}/edit` },
            { label: "Delete", type: "delete", icon: <Trash2 className="h-4 w-4" />, permissionKey: "estimates_delete" },
          ]}
          onDelete={async (id) => {
            const result = await deleteEstimate(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
