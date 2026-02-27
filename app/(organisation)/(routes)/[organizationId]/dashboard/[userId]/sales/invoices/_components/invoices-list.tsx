"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { columns, type Invoice } from "./columns";
import Link from "next/link";
import { AIEmailContext } from "./ai-email-context";

interface InvoicesListProps {
  invoices: any[];
  summary: any;
  hasCreatePermission: boolean;
  hasAIAccess: boolean;
  organizationId: string;
  userId: string;
}

export default function InvoicesList({ invoices, summary, hasCreatePermission, hasAIAccess, organizationId, userId }: InvoicesListProps) {
  const formattedInvoices: Invoice[] = invoices.map((inv) => ({
    _id: inv._id,
    id: inv._id,
    invoiceNumber: inv.invoiceNumber,
    customer: inv.customerId?.name || "N/A",
    customerName: inv.customerId?.name || "N/A",
    customerEmail: inv.customerId?.email || "",
    date: new Date(inv.invoiceDate).toLocaleDateString(),
    dueDate: new Date(inv.dueDate).toLocaleDateString(),
    amount: inv.totalAmount,
    balance: inv.totalAmount - inv.paidAmount,
    status: inv.status,
  }));

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
    <AIEmailContext.Provider value={{ hasAIAccess }}>
      <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {summary.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{summary.totalInvoices} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              GHS {summary.paidAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              GHS {summary.outstanding.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.overdue}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoices</CardTitle>
            {hasCreatePermission && (
              <Link href={`/${organizationId}/dashboard/${userId}/sales/invoices/new`}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900">Invoice Editing Policy</h4>
                <p className="mt-1 text-sm text-blue-800">
                  Only invoices with <span className="font-semibold">Draft</span> status can be edited. Once an invoice is sent, paid, or marked as overdue, it cannot be modified to maintain accurate financial records and audit trails.
                </p>
              </div>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={formattedInvoices}
            searchKey="customer"
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>
    </div>
    </AIEmailContext.Provider>
  );
}
