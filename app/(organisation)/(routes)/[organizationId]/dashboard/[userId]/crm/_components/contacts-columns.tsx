"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { deleteContact } from "@/lib/actions/contact.action";
import { CellAction } from "@/components/table/cell-action";

export type Contact = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  customerId: any;
  isPrimary: boolean;
};

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.firstName} {row.original.lastName}</div>
        {row.original.jobTitle && <div className="text-xs text-muted-foreground">{row.original.jobTitle}</div>}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.getValue("phone") || "—",
  },
  {
    accessorKey: "customerId",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.getValue("customerId") as any;
      return customer?.name || "—";
    },
  },
  {
    accessorKey: "isPrimary",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isPrimary") ? "default" : "secondary"}>
        {row.getValue("isPrimary") ? "Primary" : "Secondary"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contact = row.original;
      const pathname = usePathname();

      return (
        <CellAction
          data={contact}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              permissionKey: "contacts_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "contacts_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteContact(id);
            if (!result.success) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
