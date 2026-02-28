"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Ban, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateOrganizationStatus } from "@/lib/actions/super-admin.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrgActionsMenuProps {
  orgId: string;
  currentStatus: string;
}

export function OrgActionsMenu({ orgId, currentStatus }: OrgActionsMenuProps) {
  const router = useRouter();

  const handleStatusChange = async (status: string) => {
    const result = await updateOrganizationStatus(orgId, status);
    if (result.success) {
      toast.success(`Organization ${status}`);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/super-admin/organizations/${orgId}`)}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        {currentStatus !== "active" && (
          <DropdownMenuItem onClick={() => handleStatusChange("active")}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Activate
          </DropdownMenuItem>
        )}
        {currentStatus === "active" && (
          <DropdownMenuItem onClick={() => handleStatusChange("suspended")}>
            <Ban className="h-4 w-4 mr-2" />
            Suspend
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
