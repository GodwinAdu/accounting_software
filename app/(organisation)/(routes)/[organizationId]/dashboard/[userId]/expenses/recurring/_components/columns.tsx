"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteRecurringExpense } from "@/lib/actions/recurring-expense.action";
import { CellAction } from "@/components/table/cell-action";

export type RecurringExpense = {
  _id: string;
  id: string;
  profileName: string;
  vendor: string;
  category: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  nextDate: string;
  status: "active" | "paused" | "expired";
  expensesGenerated: number;
};

export const columns: ColumnDef<RecurringExpense>[] = [
  {
    accessorKey: "profileName",
    header: "Profile Name",
    cell: ({ row }) => {
      return <div className="font-semibold">{row.getValue("profileName")}</div>;
    },
  },
  {
    accessorKey: "vendor",
    header: "Vendor",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <Badge variant="outline">{row.getValue("category")}</Badge>;
    },
  },
  {
    accessorKey: "frequency",
    header: "Frequency",
    cell: ({ row }) => {
      const frequency = row.getValue("frequency") as string;
      const frequencyConfig = {
        daily: { label: "Daily", className: "bg-purple-100 text-purple-700" },
        weekly: { label: "Weekly", className: "bg-blue-100 text-blue-700" },
        monthly: { label: "Monthly", className: "bg-emerald-100 text-emerald-700" },
        quarterly: { label: "Quarterly", className: "bg-orange-100 text-orange-700" },
        yearly: { label: "Yearly", className: "bg-indigo-100 text-indigo-700" },
      };
      const config = frequencyConfig[frequency as keyof typeof frequencyConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
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
    accessorKey: "nextDate",
    header: "Next Expense",
    cell: ({ row }) => {
      return <div className="font-medium text-emerald-600">{row.getValue("nextDate")}</div>;
    },
  },
  {
    accessorKey: "expensesGenerated",
    header: "Generated",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("expensesGenerated")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
        paused: { label: "Paused", className: "bg-yellow-100 text-yellow-700" },
        expired: { label: "Expired", className: "bg-gray-100 text-gray-700" },
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
              permissionKey: "recurringExpenses_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "recurringExpenses_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteRecurringExpense(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
