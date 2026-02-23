"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deletePayment } from "@/lib/actions/payment.action";
import { CellAction } from "@/components/table/cell-action";

export type Payment = {
  _id: string;
  id: string;
  paymentNumber: string;
  date: string;
  customer: string;
  invoice: string;
  amount: number;
  paymentMethod: "bank_transfer" | "cash" | "cheque" | "mobile_money" | "card";
  reference: string;
  status: "completed" | "pending" | "failed";
};

export const columns: ColumnDef<Payment>[] = [
  { accessorKey: "paymentNumber", header: "Payment #", cell: ({ row }) => <div className="font-mono font-semibold">{row.getValue("paymentNumber")}</div> },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "invoice", header: "Invoice", cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("invoice")}</div> },
  {
    accessorKey: "paymentMethod",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      const methodConfig = {
        bank_transfer: { label: "Bank Transfer", className: "bg-blue-100 text-blue-700" },
        cash: { label: "Cash", className: "bg-green-100 text-green-700" },
        cheque: { label: "Cheque", className: "bg-purple-100 text-purple-700" },
        mobile_money: { label: "Mobile Money", className: "bg-orange-100 text-orange-700" },
        card: { label: "Card", className: "bg-indigo-100 text-indigo-700" },
      };
      const config = methodConfig[method as keyof typeof methodConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  { accessorKey: "amount", header: "Amount", cell: ({ row }) => <div className="font-semibold">GHS {row.getValue<number>("amount").toLocaleString()}</div> },
  { accessorKey: "reference", header: "Reference", cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.getValue("reference")}</div> },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700" },
        pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
        failed: { label: "Failed", className: "bg-red-100 text-red-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;
      const params = useParams();
      const pathname = usePathname();
      const segments = pathname.split('/');
      const orgId = segments[1];
      const userId = segments[3];

      return (
        <CellAction
          data={payment}
          actions={[
            { label: "Edit", type: "edit", icon: <Edit className="h-4 w-4" />, permissionKey: "paymentsReceived_update", href: `/${orgId}/dashboard/${userId}/sales/payments/${payment._id}/edit` },
            { label: "Delete", type: "delete", icon: <Trash2 className="h-4 w-4" />, permissionKey: "paymentsReceived_delete" },
          ]}
          onDelete={async (id) => {
            const result = await deletePayment(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
