"use client";

import { ColumnDef } from "@tantml:parameter/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { deleteLoan } from "@/lib/actions/loan.action";
import { CellAction } from "@/components/table/cell-action";

export type Loan = {
  _id: string;
  loanNumber: string;
  loanName: string;
  loanType: "term" | "line-of-credit" | "mortgage" | "other";
  lender: string;
  principalAmount: number;
  interestRate: number;
  outstandingBalance: number;
  startDate: Date;
  maturityDate: Date;
  status: "active" | "paid-off" | "defaulted";
};

export const columns: ColumnDef<Loan>[] = [
  {
    accessorKey: "loanNumber",
    header: "Loan #",
    cell: ({ row }) => {
      return <div className="font-mono font-semibold">{row.getValue("loanNumber")}</div>;
    },
  },
  {
    accessorKey: "loanName",
    header: "Loan Name",
  },
  {
    accessorKey: "lender",
    header: "Lender",
  },
  {
    accessorKey: "loanType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("loanType") as string;
      const typeConfig = {
        "term": "Term Loan",
        "line-of-credit": "Line of Credit",
        "mortgage": "Mortgage",
        "other": "Other",
      };
      return <Badge variant="outline">{typeConfig[type as keyof typeof typeConfig]}</Badge>;
    },
  },
  {
    accessorKey: "principalAmount",
    header: "Principal",
    cell: ({ row }) => {
      return <div className="font-semibold">GHS {row.getValue<number>("principalAmount").toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "interestRate",
    header: "Rate",
    cell: ({ row }) => {
      return <div>{row.getValue<number>("interestRate")}%</div>;
    },
  },
  {
    accessorKey: "outstandingBalance",
    header: "Outstanding",
    cell: ({ row }) => {
      return <div className="font-semibold text-red-600">GHS {row.getValue<number>("outstandingBalance").toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "maturityDate",
    header: "Maturity Date",
    cell: ({ row }) => {
      return new Date(row.getValue("maturityDate")).toLocaleDateString();
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
        "paid-off": { label: "Paid Off", className: "bg-gray-100 text-gray-700" },
        defaulted: { label: "Defaulted", className: "bg-red-100 text-red-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const loan = row.original;
      const pathname = usePathname();

      return (
        <CellAction
          data={loan}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              href: `${pathname}/${loan._id}`,
              permissionKey: "loans_edit",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "loans_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteLoan(id);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
