"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CheckCircle } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteSalesOrder, confirmSalesOrder } from "@/lib/actions/sales-order.action";
import { CellAction } from "@/components/table/cell-action";
import { format } from "date-fns";
import { toast } from "sonner";

export type SalesOrder = {
  _id: string;
  orderNumber: string;
  customerId: { name: string; company?: string };
  orderDate: Date;
  total: number;
  balance: number;
  status: string;
};

export const columns: ColumnDef<SalesOrder>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order #",
  },
  {
    accessorKey: "customerId.name",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original.customerId;
      return (
        <div>
          <p className="font-medium">{customer?.name}</p>
          {customer?.company && (
            <p className="text-xs text-muted-foreground">{customer.company}</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "orderDate",
    header: "Date",
    cell: ({ row }) => format(new Date(row.getValue("orderDate")), "PPP"),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"));
      return <span className="font-medium">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const balance = row.getValue("balance") as number;
      return balance > 0 ? (
        <span className="font-medium text-orange-600">GHS {balance.toLocaleString()}</span>
      ) : (
        <span className="text-muted-foreground">Paid</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const colors: Record<string, string> = {
        draft: "bg-gray-500",
        confirmed: "bg-blue-600",
        delivered: "bg-emerald-600",
        paid: "bg-green-600",
        cancelled: "bg-red-600",
      };
      return (
        <Badge className={colors[status] || "bg-gray-500"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      const params = useParams();
      const pathname = usePathname();

      const actions = [
        {
          label: "Edit",
          type: "edit" as const,
          icon: <Edit className="h-4 w-4" />,
          href: `${pathname}/${order._id}/edit`,
          permissionKey: "sales_update",
          hidden: order.status !== "draft",
        },
        {
          label: "Confirm",
          type: "custom" as const,
          icon: <CheckCircle className="h-4 w-4" />,
          permissionKey: "sales_update",
          hidden: order.status !== "draft",
          onClick: async () => {
            const result = await confirmSalesOrder(order._id, pathname);
            if (result.error) {
              toast.error(result.error);
            } else {
              toast.success("Sales order confirmed");
            }
          },
        },
        {
          label: "Delete",
          type: "delete" as const,
          icon: <Trash2 className="h-4 w-4" />,
          permissionKey: "sales_delete",
          hidden: order.status !== "draft",
        },
      ].filter(action => !action.hidden);

      return (
        <CellAction
          data={order}
          actions={actions}
          onDelete={async (id) => {
            const result = await deleteSalesOrder(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
