"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type JournalEntry = {
  id: string;
  reference: string;
  date: string;
  description: string;
  totalDebit: number;
  totalCredit: number;
  status: string;
  createdBy: string;
};

export const columns: ColumnDef<JournalEntry>[] = [
  {
    accessorKey: "reference",
    header: "Reference",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "totalDebit",
    header: "Total Debit",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalDebit"));
      return <span className="font-medium">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "totalCredit",
    header: "Total Credit",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalCredit"));
      return <span className="font-medium">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "posted" ? "default" : "secondary"}
          className={status === "posted" ? "bg-emerald-600" : "bg-yellow-600"}
        >
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {status === "draft" && (
              <>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Entry
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Post Entry
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
