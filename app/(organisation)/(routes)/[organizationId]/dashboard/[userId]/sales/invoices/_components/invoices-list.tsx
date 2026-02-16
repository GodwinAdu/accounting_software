"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { columns, type Invoice } from "./columns";
import Link from "next/link";

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    customer: "ABC Corporation",
    date: "2024-01-15",
    dueDate: "2024-02-14",
    amount: 45000,
    balance: 45000,
    status: "sent",
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    customer: "XYZ Limited",
    date: "2024-01-10",
    dueDate: "2024-02-09",
    amount: 32000,
    balance: 0,
    status: "paid",
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    customer: "Tech Solutions",
    date: "2023-12-20",
    dueDate: "2024-01-19",
    amount: 28000,
    balance: 28000,
    status: "overdue",
  },
  {
    id: "4",
    invoiceNumber: "INV-004",
    customer: "Global Traders",
    date: "2024-01-12",
    dueDate: "2024-02-11",
    amount: 18500,
    balance: 18500,
    status: "sent",
  },
  {
    id: "5",
    invoiceNumber: "INV-005",
    customer: "Smart Systems",
    date: "2024-01-08",
    dueDate: "2024-02-07",
    amount: 24000,
    balance: 0,
    status: "paid",
  },
  {
    id: "6",
    invoiceNumber: "INV-006",
    customer: "Digital Agency",
    date: "2024-01-14",
    dueDate: "2024-02-13",
    amount: 15000,
    balance: 15000,
    status: "draft",
  },
];

interface InvoicesListProps {
  organizationId: string;
  userId: string;
}

export default function InvoicesList({ organizationId, userId }: InvoicesListProps) {
  const [invoices] = useState(mockInvoices);

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balance, 0);
  const overdueCount = invoices.filter(inv => inv.status === "overdue").length;

  const filterGroups = [
    {
      id: "status",
      label: "Status",
      options: [
        { _id: "draft", label: "Draft" },
        { _id: "sent", label: "Sent" },
        { _id: "paid", label: "Paid" },
        { _id: "overdue", label: "Overdue" },
        { _id: "cancelled", label: "Cancelled" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalInvoiced.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{invoices.length} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              GHS {totalPaid.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {invoices.filter(i => i.status === "paid").length} paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
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
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoices</CardTitle>
            <Link href={`/${organizationId}/dashboard/${userId}/sales/invoices/new`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={invoices}
            searchKey="customer"
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>
    </div>
  );
}
