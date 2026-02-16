"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, DollarSign, TrendingUp } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { columns, type Customer } from "./columns";
import Link from "next/link";

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "John Mensah",
    email: "john@abccorp.com",
    phone: "024-123-4567",
    company: "ABC Corporation",
    totalInvoiced: 145000,
    totalPaid: 100000,
    balance: 45000,
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Osei",
    email: "sarah@xyzltd.com",
    phone: "020-987-6543",
    company: "XYZ Limited",
    totalInvoiced: 98000,
    totalPaid: 98000,
    balance: 0,
    status: "active",
  },
  {
    id: "3",
    name: "Kwame Asante",
    email: "kwame@techsol.com",
    phone: "027-555-1234",
    company: "Tech Solutions",
    totalInvoiced: 76000,
    totalPaid: 48000,
    balance: 28000,
    status: "active",
  },
  {
    id: "4",
    name: "Ama Boateng",
    email: "ama@globaltraders.com",
    phone: "024-777-8888",
    company: "Global Traders",
    totalInvoiced: 52000,
    totalPaid: 33500,
    balance: 18500,
    status: "active",
  },
  {
    id: "5",
    name: "Kofi Adjei",
    email: "kofi@smartsys.com",
    phone: "020-333-4444",
    company: "Smart Systems",
    totalInvoiced: 64000,
    totalPaid: 64000,
    balance: 0,
    status: "inactive",
  },
];

interface CustomersListProps {
  organizationId: string;
  userId: string;
}

export default function CustomersList({ organizationId, userId }: CustomersListProps) {
  const [customers] = useState(mockCustomers);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalInvoiced, 0);
  const totalOutstanding = customers.reduce((sum, c) => sum + c.balance, 0);

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
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">{activeCustomers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
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
            <TrendingUp className="h-4 w-4 text-orange-600" />
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
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {Math.round(totalRevenue / totalCustomers).toLocaleString()}
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
            <Link href={`/${organizationId}/dashboard/${userId}/sales/customers/new`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={customers}
            searchKey="name"
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>
    </div>
  );
}
