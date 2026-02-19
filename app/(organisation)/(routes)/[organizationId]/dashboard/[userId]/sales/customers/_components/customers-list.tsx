"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns, type Customer } from "./columns";
import Link from "next/link";

interface CustomersListProps {
  customers: any[];
  hasCreatePermission: boolean;
  organizationId: string;
  userId: string;
}

export default function CustomersList({ customers, hasCreatePermission, organizationId, userId }: CustomersListProps) {
  const formattedCustomers: Customer[] = customers.map((customer) => ({
    _id: customer._id,
    id: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    company: customer.company || "—",
    totalInvoiced: 0,
    totalPaid: 0,
    balance: 0,
    status: customer.status,
  }));

  const totalCustomers = formattedCustomers.length;
  const activeCustomers = formattedCustomers.filter(c => c.status === "active").length;
  const totalRevenue = formattedCustomers.reduce((sum, c) => sum + c.totalInvoiced, 0);
  const totalOutstanding = formattedCustomers.reduce((sum, c) => sum + c.balance, 0);

  const filterGroups = [
    {
      id: "status",
      label: "Status",
      options: [
        { _id: "active", label: "Active" },
        { _id: "inactive", label: "Inactive" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">{activeCustomers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              GHS {totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              GHS {totalOutstanding.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Invoice Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers).toLocaleString() : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customers</CardTitle>
            {hasCreatePermission && (
              <Link href={`/${organizationId}/dashboard/${userId}/sales/customers/new`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={formattedCustomers}
            searchKey="name"
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>
    </div>
  );
}
