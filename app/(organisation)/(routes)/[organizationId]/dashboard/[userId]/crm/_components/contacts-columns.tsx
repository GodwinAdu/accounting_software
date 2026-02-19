"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { deleteContact } from "@/lib/actions/contact.action";
import { CellAction } from "@/components/table/cell-action";

export type Contact = {
  _id: string;
  contactNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  type: string;
};

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    customer: "bg-blue-100 text-blue-700",
    vendor: "bg-green-100 text-green-700",
    partner: "bg-purple-100 text-purple-700",
    other: "bg-gray-100 text-gray-700",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
};

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "contactNumber",
    header: "Contact #",
    cell: ({ row }) => <div className="font-medium">{row.getValue("contactNumber")}</div>,
  },
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("firstName")} {row.original.lastName}
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
    cell: ({ row }) => <div>{row.getValue("phone") || "—"}</div>,
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => <div>{row.getValue("company") || "—"}</div>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div>{row.getValue("title") || "—"}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <Badge className={getTypeColor(type)}>{type}</Badge>;
    },
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
            const result = await deleteContact(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
