"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteRecurringInvoice } from "@/lib/actions/recurring-invoice.action";
import { CellAction } from "@/components/table/cell-action";

export type RecurringInvoice = {
  _id: string;
  id: string;
  profileName: string;
  customer: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  startDate: string;
  nextInvoice: string;
  status: "active" | "paused" | "expired";
  invoicesGenerated: number;
};

export const columns: ColumnDef<RecurringInvoice>[] = [
  { accessorKey: "profileName", header: "Profile Name", cell: ({ row }) => <div className="font-semibold">{row.getValue("profileName")}</div> },
  { accessorKey: "customer", header: "Customer" },
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
  { accessorKey: "amount", header: "Amount", cell: ({ row }) => <div className="font-semibold">GHS {row.getValue<number>("amount").toLocaleString()}</div> },
  { accessorKey: "startDate", header: "Start Date" },
  { accessorKey: "nextInvoice", header: "Next Invoice", cell: ({ row }) => <div className="font-medium text-emerald-600">{row.getValue("nextInvoice")}</div> },
  { accessorKey: "invoicesGenerated", header: "Generated", cell: ({ row }) => <div className="text-center">{row.getValue("invoicesGenerated")}</div> },
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
      const invoice = row.original;
      const params = useParams();
      const pathname = usePathname();

      return (
        <CellAction
          data={invoice}
          actions={[
            { label: "Edit", type: "edit", icon: <Edit className="h-4 w-4" />, permissionKey: "recurringInvoices_update" },
            { label: "Delete", type: "delete", icon: <Trash2 className="h-4 w-4" />, permissionKey: "recurringInvoices_delete" },
          ]}
          onDelete={async (id) => {
            const result = await deleteRecurringInvoice(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
