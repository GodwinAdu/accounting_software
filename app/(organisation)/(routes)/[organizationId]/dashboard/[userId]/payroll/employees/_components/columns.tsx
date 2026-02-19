"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { deleteEmployee } from "@/lib/actions/employee.action";
import { CellAction } from "@/components/table/cell-action";

export type Employee = {
  _id: string;
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  status: string;
  hireDate: string;
};

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "salary",
    header: "Salary",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("salary"));
      return <span className="font-medium">GHS {amount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"} className={status === "active" ? "bg-emerald-600" : ""}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      const pathname = usePathname();

      return (
        <CellAction
          data={employee}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              permissionKey: "employees_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "employees_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteEmployee(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
