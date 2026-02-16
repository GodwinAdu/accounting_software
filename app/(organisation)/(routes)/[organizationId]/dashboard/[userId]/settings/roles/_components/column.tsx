"use client"

import { useParams } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2 } from "lucide-react"
import { CellAction } from "@/components/table/cell-action"


const handleDelete = async (id: string): Promise<void> => {
  try {
    // await deleteBuilding(id)
    console.log(`Item with id ${id} deleted successfully`)
  } catch (error) {
    console.error("Delete error:", error)
    throw error
  }
}

export const RoleColumns = (): ColumnDef<IRole>[] => {
  const params = useParams<{ schoolId: string; userId: string }>()
  const { schoolId, userId } = params;

  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "displayName",
      header: "Display Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original

        return (
          <CellAction
            data={data}
            onDelete={handleDelete}
            actions={[
              {
                label: "View",
                type: "view",
                href: `/${schoolId}/admin/${userId}/system-config/manage-role/${data._id}`,
                icon: <Edit className="h-4 w-4" />,
                permissionKey: "viewRole",
              },
              {
                label: "Edit",
                type: "edit",
                href: `/${schoolId}/admin/${userId}/system-config/manage-role/${data._id}/edit`,
                icon: <Edit className="h-4 w-4" />,
                permissionKey: "editRole",
              },
              {
                label: "Delete",
                type: "delete",
                icon: <Trash2 className="h-4 w-4" />,
                permissionKey: "deleteRole",
              },
            ]}
          />
        )
      },
    },
  ]
}