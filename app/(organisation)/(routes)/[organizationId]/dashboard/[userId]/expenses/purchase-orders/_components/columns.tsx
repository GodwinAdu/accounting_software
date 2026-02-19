"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deletePurchaseOrder } from "@/lib/actions/purchase-order.action";
import { CellAction } from "@/components/table/cell-action";

export type PurchaseOrder = {
  _id: string;
  id: string;
  poNumber: string;
  vendor: string;
  date: string;
  expectedDate: string;
  amount: number;
  status: "draft" | "sent" | "approved" | "received" | "cancelled";
};

export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "poNumber",
    header: "PO #",
    cell: ({ row }) => {
      return <div className="font-mono font-semibold">{row.getValue("poNumber")}</div>;
    },
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
  },
  {
    accessorKey: "date",
    header: "Order Date",
  },
  {
    accessorKey: "expectedDate",
    header: "Expected Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return <div className="font-semibold">GHS {row.getValue<number>("amount").toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
        sent: { label: "Sent", className: "bg-blue-100 text-blue-700" },
        approved: { label: "Approved", className: "bg-purple-100 text-purple-700" },
        received: { label: "Received", className: "bg-emerald-100 text-emerald-700" },
        cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const po = row.original;
      const params = useParams();
      const pathname = usePathname();

      return (
        <CellAction
          data={po}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              permissionKey: "purchaseOrders_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "purchaseOrders_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deletePurchaseOrder(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
