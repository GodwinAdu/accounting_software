"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";

interface VendorsListProps {
  vendors: any[];
  hasCreatePermission: boolean;
}

export function VendorsList({ vendors, hasCreatePermission }: VendorsListProps) {
  const router = useRouter();

  const totalVendors = vendors.length;
  const activeVendors = vendors.filter((v) => v.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVendors}</div>
            <p className="text-xs text-muted-foreground">{activeVendors} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{activeVendors}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {totalVendors - activeVendors}
            </div>
            <p className="text-xs text-muted-foreground">Not active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vendors.filter(v => {
                const created = new Date(v.createdAt);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">New vendors</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vendor Directory</CardTitle>
          </div>
          {hasCreatePermission && (
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("./vendors/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Vendor
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={vendors}
            searchKey="companyName"
          />
        </CardContent>
      </Card>
    </div>
  );
}
