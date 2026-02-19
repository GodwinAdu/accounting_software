"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Lock } from "lucide-react";
import { usePathname } from "next/navigation";
import { deleteAccount } from "@/lib/actions/account.action";
import { CellAction } from "@/components/table/cell-action";

export type Account = {
  _id: string;
  id: string;
  code: string;
  name: string;
  type: string;
  subType: string;
  balance: number;
  status: string;
  isSystemAccount: boolean;
  parentAccount: string;
};

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "code",
    header: "Account Code",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold">{row.getValue("code")}</span>
          {row.original.isSystemAccount && (
            <Lock className="h-3 w-3 text-muted-foreground" title="System Account" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Account Name",
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.getValue("name")}</div>
          {row.original.parentAccount && (
            <div className="text-xs text-muted-foreground">Parent: {row.original.parentAccount}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const colors: Record<string, string> = {
        Asset: "bg-emerald-100 text-emerald-700",
        Liability: "bg-red-100 text-red-700",
        Equity: "bg-blue-100 text-blue-700",
        Revenue: "bg-purple-100 text-purple-700",
        Expense: "bg-orange-100 text-orange-700",
      };
      return <Badge className={colors[type] || ""}>{type}</Badge>;
    },
  },
  {
    accessorKey: "subType",
    header: "Sub Type",
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{row.getValue("subType")}</span>;
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));
      const isNegative = amount < 0;
      return (
        <span className={`font-medium ${isNegative ? "text-red-600" : "text-emerald-600"}`}>
          GHS {Math.abs(amount).toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge 
          variant="outline" 
          className={status === "active" ? "border-emerald-600 text-emerald-600" : ""}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const account = row.original;
      const pathname = usePathname();

      return (
        <CellAction
          data={account}
          actions={[
            {
              label: "View Ledger",
              type: "view",
              icon: <Eye className="h-4 w-4" />,
              permissionKey: "generalLedger_view",
            },
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              permissionKey: "accounts_update",
              disabled: account.isSystemAccount,
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "accounts_delete",
              disabled: account.isSystemAccount,
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteAccount(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
