"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Send, Eye } from "lucide-react";

export type Form1099 = {
  id: string;
  contractor: string;
  tin: string;
  year: string;
  totalPayments: number;
  whtDeducted: number;
  status: string;
};

export const columns: ColumnDef<Form1099>[] = [
  {
    accessorKey: "contractor",
    header: "Contractor/Vendor",
  },
  {
    accessorKey: "tin",
    header: "TIN",
  },
  {
    accessorKey: "year",
    header: "Tax Year",
  },
  {
    accessorKey: "totalPayments",
    header: "Total Payments",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPayments"));
      return <span className="font-medium">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "whtDeducted",
    header: "WHT Deducted",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("whtDeducted"));
      return <span className="font-medium text-red-600">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={status === "sent" ? "bg-emerald-600" : "bg-yellow-600"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          {status !== "sent" && (
            <Button variant="ghost" size="sm">
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];
