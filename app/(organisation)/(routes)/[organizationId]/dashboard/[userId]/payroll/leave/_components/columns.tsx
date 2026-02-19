"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { approveLeaveRequest, rejectLeaveRequest } from "@/lib/actions/leave-request.action";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { checkPermission } from "@/lib/helpers/auth";

export type LeaveRequest = {
  _id: string;
  id: string;
  employee: string;
  employeeNumber: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
  reason: string;
};

function ApprovalActions({ requestId, status }: { requestId: string; status: string }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  if (status !== "pending") return null;

  const handleApprove = async () => {
    setLoading(true);
    await approveLeaveRequest(requestId);
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await rejectLeaveRequest(requestId, "Rejected by manager");
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleApprove} disabled={loading}>
        <Check className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="destructive" onClick={handleReject} disabled={loading}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export const columns: ColumnDef<LeaveRequest>[] = [
  {
    accessorKey: "employeeNumber",
    header: "Employee ID",
  },
  {
    accessorKey: "employee",
    header: "Employee",
  },
  {
    accessorKey: "leaveType",
    header: "Leave Type",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "days",
    header: "Days",
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue("days")} days</span>;
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
        cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original;
      return <ApprovalActions requestId={request._id} status={request.status} />;
    },
  },
];
