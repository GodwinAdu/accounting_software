"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export type Estimate = {
  id: string;
  estimateNumber: string;
  customer: string;
  date: string;
  expiryDate: string;
  amount: number;
  status: "draft" | "sent" | "accepted" | "declined" | "expired";
};

export const columns: ColumnDef<Estimate>[] = [
  { accessorKey: "estimateNumber", header: "Estimate #" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "expiryDate", header: "Expiry Date" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <div className="font-semibold">GHS {row.getValue<number>("amount").toLocaleString()}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const config: Record<string, string> = {
        draft: "bg-gray-100 text-gray-700",
        sent: "bg-blue-100 text-blue-700",
        accepted: "bg-emerald-100 text-emerald-700",
        declined: "bg-red-100 text-red-700",
        expired: "bg-orange-100 text-orange-700",
      };
      return <Badge className={config[status]}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Convert to Invoice</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
