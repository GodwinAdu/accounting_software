"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteInvoice } from "@/lib/actions/invoice.action";
import { CellAction } from "@/components/table/cell-action";
import PayInvoiceButton from "@/components/payment/pay-invoice-button";

export type Invoice = {
  _id: string;
  id: string;
  invoiceNumber: string;
  customer: string;
  customerEmail?: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  balance: number;
};

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice #",
    cell: ({ row }) => {
      return <div className="font-mono font-semibold">{row.getValue("invoiceNumber")}</div>;
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return <div className="font-semibold">GHS {row.getValue<number>("amount").toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const balance = row.getValue<number>("balance");
      return (
        <div className={balance > 0 ? "font-semibold text-orange-600" : "text-muted-foreground"}>
          GHS {balance.toLocaleString()}
        </div>
      );
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
        paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700" },
        overdue: { label: "Overdue", className: "bg-red-100 text-red-700" },
        cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original;
      const params = useParams();
      const pathname = usePathname();

      if (invoice.status === "sent" || invoice.status === "overdue") {
        return (
          <PayInvoiceButton
            invoiceId={invoice._id}
            amount={invoice.balance}
            currency="GHS"
            customerEmail={invoice.customerEmail || ""}
          />
        );
      }

      return (
        <CellAction
          data={invoice}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              permissionKey: "invoices_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "invoices_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteInvoice(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
