"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

export type VATReturn = {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  outputVAT: number;
  inputVAT: number;
  netVAT: number;
  status: string;
  filedDate: string;
};

export const columns: ColumnDef<VATReturn>[] = [
  {
    accessorKey: "period",
    header: "Period",
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
    accessorKey: "outputVAT",
    header: "Output VAT",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("outputVAT"));
      return <span className="font-medium text-emerald-600">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "inputVAT",
    header: "Input VAT",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("inputVAT"));
      return <span className="font-medium text-blue-600">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "netVAT",
    header: "Net VAT",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("netVAT"));
      return <span className="font-medium text-red-600">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={status === "filed" ? "bg-emerald-600" : "bg-yellow-600"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "filedDate",
    header: "Filed Date",
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
