"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Send, Eye } from "lucide-react";

export type P9Form = {
  id: string;
  employee: string;
  employeeId: string;
  year: string;
  grossPay: number;
  taxPaid: number;
  ssnit: number;
  status: string;
};

export const columns: ColumnDef<P9Form>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "employee",
    header: "Employee Name",
  },
  {
    accessorKey: "year",
    header: "Tax Year",
  },
  {
    accessorKey: "grossPay",
    header: "Gross Pay",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("grossPay"));
      return <span className="font-medium">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "taxPaid",
    header: "PAYE Tax",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("taxPaid"));
      return <span className="font-medium text-red-600">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "ssnit",
    header: "SSNIT",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("ssnit"));
      return <span className="font-medium text-blue-600">GHS {amount.toLocaleString()}</span>;
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
