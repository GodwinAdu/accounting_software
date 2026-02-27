"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { deleteDepartment } from "@/lib/actions/department.action";
import { DepartmentModal } from "./DepartmentModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const handleDelete = async (id: string): Promise<void> => {
    try {
        await deleteDepartment(id);
        toast.success("Department deleted successfully");
        window.location.reload();
    } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete department");
        throw error;
    }
}

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "name",
        header: "Department Name",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{row.original.name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "createdBy",
        header: "Created By",
        cell: ({ row }) => {
            const createdBy = row.original.createdBy;
            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={createdBy?.imgUrl || ""} alt={createdBy?.fullName || "User"} />
                        <AvatarFallback>{createdBy?.fullName ? createdBy.fullName.charAt(0) : "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">{createdBy?.fullName || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{createdBy?.email || ""}</p>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
            const date = row.original.createdAt;
            return date ? new Date(date).toLocaleDateString() : "N/A";
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const department = row.original
            return (
                <div className="flex items-center gap-2">
                    <DepartmentModal 
                        department={department}
                        trigger={
                            <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                            </Button>
                        }
                    />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Department</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete "{department.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(department._id)} className="bg-destructive text-destructive-foreground">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )
        }
    },
];