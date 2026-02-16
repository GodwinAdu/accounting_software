"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Edit,
    Trash2,
    Eye,
    UserX,
    UserCheck,
    Key,
    Mail,
    Shield,
    Clock,
    MapPin,
    Award
} from "lucide-react";
import { CellAction } from "@/components/table/cell-action";
import { toast } from "sonner";






const handleDelete = async (id: string): Promise<void> => {
    try {
        // await deleteMember(id);
        toast.success("Member deleted successfully");
        window.location.reload();
    } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete member");
        throw error;
    }
}






export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: "Departments",
    },
    {
        accessorKey: "createdBy",
        header: "Created By",
        cell: ({ row }) => {
            const createdBy = row.original.createdBy;
            return (
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={createdBy?.avatarUrl || ""} alt={createdBy?.fullName || "User Avatar"} />
                        <AvatarFallback>{createdBy?.fullName ? createdBy.fullName.charAt(0) : "U"}</AvatarFallback>
                    </Avatar>
                    <span>{createdBy?.fullName || "Unknown"}</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const member = row.original
            return (
                <CellAction
                    data={member}
                    onDelete={handleDelete}
                    actions={[
                        {
                            label: "Edit Profile",
                            type: "edit",
                            href: `/dashboard/members/${member._id}/edit`,
                            icon: <Edit className="h-4 w-4" />,
                        },
                        {
                            label: "Delete ",
                            type: "delete",
                            icon: <Trash2 className="h-4 w-4" />,
                        },
                    ]}
                />
            )
        }
    },
];