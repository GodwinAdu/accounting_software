"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type TimeEntry = {
  _id: string;
  id: string;
  employee: string;
  employeeNumber: string;
  date: string;
  clockIn: string;
  clockOut: string;
  totalHours: number;
  overtime: number;
  status: string;
};

export const columns: ColumnDef<TimeEntry>[] = [
  {
    accessorKey: "employeeNumber",
    header: "Employee ID",
  },
  {
    accessorKey: "employee",
    header: "Employee",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "clockIn",
    header: "Clock In",
  },
  {
    accessorKey: "clockOut",
    header: "Clock Out",
  },
  {
    accessorKey: "totalHours",
    header: "Total Hours",
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue<number>("totalHours").toFixed(1)}h</span>;
    },
  },
  {
    accessorKey: "overtime",
    header: "Overtime",
    cell: ({ row }) => {
      const overtime = row.getValue("overtime") as number;
      return overtime > 0 ? (
        <span className="font-medium text-blue-600">{overtime.toFixed(1)}h</span>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
        approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700" },
        rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
];
