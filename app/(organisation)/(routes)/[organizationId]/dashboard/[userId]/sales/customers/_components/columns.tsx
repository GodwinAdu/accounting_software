"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteCustomer } from "@/lib/actions/customer.action";
import { CellAction } from "@/components/table/cell-action";

export type Customer = {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  totalInvoiced: number;
  totalPaid: number;
  balance: number;
  status: "active" | "inactive";
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "totalInvoiced",
    header: "Total Invoiced",
    cell: ({ row }) => {
      return <div>GHS {row.getValue<number>("totalInvoiced").toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const balance = row.getValue<number>("balance");
      return (
        <div className={balance > 0 ? "font-semibold text-orange-600" : "text-muted-foreground"}>
          GHS {balance.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;
      const params = useParams();
      const pathname = usePathname();

      return (
        <CellAction
          data={customer}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              permissionKey: "customers_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "customers_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteCustomer(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
