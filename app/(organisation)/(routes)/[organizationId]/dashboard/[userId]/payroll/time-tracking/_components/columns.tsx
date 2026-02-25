"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { approveTimeEntry, rejectTimeEntry } from "@/lib/actions/time-entry.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const router = useRouter();
      const status = row.getValue("status") as string;
      const entryId = row.original._id;

      if (status !== "pending") return null;

      const handleApprove = async () => {
        const result = await approveTimeEntry(entryId);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Time entry approved");
          router.refresh();
        }
      };

      const handleReject = async () => {
        const result = await rejectTimeEntry(entryId);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Time entry rejected");
          router.refresh();
        }
      };

      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleApprove}>
            <Check className="h-4 w-4 text-emerald-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReject}>
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      );
    },
  },
];
