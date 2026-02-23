"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Send, CheckCircle, Package } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deletePurchaseOrder, updatePurchaseOrder } from "@/lib/actions/purchase-order.action";
import { CellAction } from "@/components/table/cell-action";

export type PurchaseOrder = {
  _id: string;
  id: string;
  poNumber: string;
  vendor: string;
  date: string;
  expectedDate: string;
  amount: number;
  status: "draft" | "sent" | "confirmed" | "received" | "cancelled";
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
      const amount = row.getValue<number>("amount") || 0;
      return <div className="font-semibold">GHS {amount.toLocaleString()}</div>;
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
        confirmed: { label: "Confirmed", className: "bg-purple-100 text-purple-700" },
        received: { label: "Received", className: "bg-emerald-100 text-emerald-700" },
        cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: "bg-gray-100 text-gray-700" };
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const po = row.original;
      const params = useParams();
      const pathname = usePathname();

      const actions = [
        {
          label: "Edit",
          type: "edit",
          icon: <Edit className="h-4 w-4" />,
          permissionKey: "purchaseOrders_update",
        },
      ];

      if (po.status === "draft") {
        actions.push({
          label: "Send to Vendor",
          type: "custom",
          icon: <Send className="h-4 w-4" />,
          permissionKey: "purchaseOrders_update",
          onClick: async () => {
            const result = await updatePurchaseOrder(po._id, { status: "sent" }, pathname);
            if (result.error) throw new Error(result.error);
          },
        } as any);
      }

      if (po.status === "sent") {
        actions.push({
          label: "Mark as Confirmed",
          type: "custom",
          icon: <CheckCircle className="h-4 w-4" />,
          permissionKey: "purchaseOrders_update",
          onClick: async () => {
            const result = await updatePurchaseOrder(po._id, { status: "confirmed" }, pathname);
            if (result.error) throw new Error(result.error);
          },
        } as any);
      }

      if (po.status === "confirmed") {
        actions.push({
          label: "Mark as Received",
          type: "custom",
          icon: <Package className="h-4 w-4" />,
          permissionKey: "purchaseOrders_update",
          onClick: async () => {
            const result = await updatePurchaseOrder(po._id, { status: "received" }, pathname);
            if (result.error) throw new Error(result.error);
          },
        } as any);
      }

      actions.push({
        label: "Delete",
        type: "delete",
        icon: <Trash2 className="h-4 w-4" />,
        permissionKey: "purchaseOrders_delete",
      });

      return (
        <CellAction
          data={po}
          actions={actions}
          onDelete={async (id) => {
            const result = await deletePurchaseOrder(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
