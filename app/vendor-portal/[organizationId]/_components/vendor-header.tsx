"use client";

import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VendorHeader({ organization, vendor, organizationId }: any) {
  const router = useRouter();

  const handleLogout = () => {
    router.push(`/vendor-portal/${organizationId}`);
  };

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{organization.name}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-3 w-3" />
              {vendor.name} • {vendor.email}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
