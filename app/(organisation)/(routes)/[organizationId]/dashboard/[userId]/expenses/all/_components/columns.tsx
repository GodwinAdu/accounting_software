"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Receipt } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteExpense } from "@/lib/actions/expense.action";
import { CellAction } from "@/components/table/cell-action";

export type Expense = {
  _id: string;
  expenseNumber: string;
  date: Date;
  vendorId?: { companyName: string };
  categoryId?: { name: string };
  amount: number;
  paymentMethod: "cash" | "card" | "bank_transfer" | "mobile_money" | "cheque";
  status: "paid" | "pending" | "approved" | "rejected";
  receiptUrl?: string;
};

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "expenseNumber",
    header: "Expense #",
    cell: ({ row }) => {
      return <div className="font-mono font-semibold">{row.getValue("expenseNumber")}</div>;
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleDateString();
    },
  },
  {
    header: "Vendor",
    cell: ({ row }) => {
      return row.original.vendorId?.companyName || "—";
    },
  },
  {
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.categoryId?.name;
      return category ? <Badge variant="outline">{category}</Badge> : "—";
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return <div className="font-semibold">GHS {row.getValue<number>("amount").toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      const methodConfig = {
        cash: "Cash",
        card: "Card",
        bank_transfer: "Bank Transfer",
        mobile_money: "Mobile Money",
        cheque: "Cheque",
      };
      return <span className="text-sm">{methodConfig[method as keyof typeof methodConfig]}</span>;
    },
  },
  {
    header: "Receipt",
    cell: ({ row }) => {
      return row.original.receiptUrl ? (
        <Receipt className="h-4 w-4 text-emerald-600" />
      ) : (
        <span className="text-xs text-muted-foreground">No</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700" },
        pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
        approved: { label: "Approved", className: "bg-blue-100 text-blue-700" },
        rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const expense = row.original;
      const params = useParams();
      const pathname = usePathname();

      return (
        <CellAction
          data={expense}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              href: `${pathname}/${expense._id}`,
              permissionKey: "expenses_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "expenses_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteExpense(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
