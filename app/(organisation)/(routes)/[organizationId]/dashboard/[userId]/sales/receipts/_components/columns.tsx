"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteReceipt } from "@/lib/actions/receipt.action";
import { CellAction } from "@/components/table/cell-action";

export type Receipt = {
  _id: string;
  id: string;
  receiptNumber: string;
  date: string;
  customer: string;
  amount: number;
  paymentMethod: "cash" | "card" | "mobile_money" | "bank_transfer";
  status: "paid" | "void";
};

export const columns: ColumnDef<Receipt>[] = [
  { accessorKey: "receiptNumber", header: "Receipt #", cell: ({ row }) => <div className="font-mono font-semibold">{row.getValue("receiptNumber")}</div> },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "customer", header: "Customer" },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      const methodConfig = {
        cash: { label: "Cash", className: "bg-green-100 text-green-700" },
        card: { label: "Card", className: "bg-indigo-100 text-indigo-700" },
        mobile_money: { label: "Mobile Money", className: "bg-orange-100 text-orange-700" },
        bank_transfer: { label: "Bank Transfer", className: "bg-blue-100 text-blue-700" },
      };
      const config = methodConfig[method as keyof typeof methodConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  { accessorKey: "amount", header: "Amount", cell: ({ row }) => <div className="font-semibold">GHS {row.getValue<number>("amount").toLocaleString()}</div> },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700" },
        void: { label: "Void", className: "bg-gray-100 text-gray-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const receipt = row.original;
      const params = useParams();
      const pathname = usePathname();

      return (
        <CellAction
          data={receipt}
          actions={[
            { label: "Edit", type: "edit", icon: <Edit className="h-4 w-4" />, permissionKey: "salesReceipts_update", href: `/${params.organizationId}/dashboard/${params.userId}/sales/receipts/${receipt._id}/edit` },
            { label: "Delete", type: "delete", icon: <Trash2 className="h-4 w-4" />, permissionKey: "salesReceipts_delete" },
          ]}
          onDelete={async (id) => {
            const result = await deleteReceipt(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
