"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteVendor } from "@/lib/actions/vendor.action";
import { CellAction } from "@/components/table/cell-action";

export type Vendor = {
  _id: string;
  vendorNumber: string;
  companyName: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  status: "active" | "inactive";
};

export const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: "vendorNumber",
    header: "Vendor #",
    cell: ({ row }) => {
      return <div className="font-mono font-semibold">{row.getValue("vendorNumber")}</div>;
    },
  },
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => {
      return <div className="font-semibold">{row.getValue("companyName")}</div>;
    },
  },
  {
    accessorKey: "contactPerson",
    header: "Contact Person",
    cell: ({ row }) => {
      return row.original.contactPerson || "—";
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return row.original.phone || "—";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={status === "active" ? "bg-emerald-600" : "bg-gray-500"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vendor = row.original;
      const params = useParams();
      const pathname = usePathname();

      return (
        <CellAction
          data={vendor}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              href: `${pathname}/${vendor._id}`,
              permissionKey: "vendors_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "vendors_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteVendor(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
