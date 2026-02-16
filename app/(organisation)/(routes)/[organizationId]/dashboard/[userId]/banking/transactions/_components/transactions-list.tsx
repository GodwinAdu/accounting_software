"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon, Plus } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { columns, type Transaction } from "./columns";

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-01-15",
    description: "Client Payment - ABC Corp",
    type: "credit",
    amount: 15000,
    balance: 156000,
    category: "Income",
    account: "GCB Bank - 1234567890",
    status: "completed",
    reference: "TXN001234",
  },
  {
    id: "2",
    date: "2024-01-14",
    description: "Office Rent Payment",
    type: "debit",
    amount: 5000,
    balance: 141000,
    category: "Rent",
    account: "GCB Bank - 1234567890",
    status: "completed",
    reference: "TXN001233",
  },
  {
    id: "3",
    date: "2024-01-13",
    description: "Payroll - January 2024",
    type: "debit",
    amount: 32000,
    balance: 146000,
    category: "Payroll",
    account: "GCB Bank - 1234567890",
    status: "completed",
    reference: "TXN001232",
  },
  {
    id: "4",
    date: "2024-01-12",
    description: "Consulting Services - XYZ Ltd",
    type: "credit",
    amount: 8500,
    balance: 178000,
    category: "Income",
    account: "Ecobank - 0987654321",
    status: "completed",
    reference: "TXN001231",
  },
  {
    id: "5",
    date: "2024-01-11",
    description: "Software Subscription",
    type: "debit",
    amount: 450,
    balance: 169500,
    category: "Software",
    account: "GCB Bank - 1234567890",
    status: "pending",
    reference: "TXN001230",
  },
  {
    id: "6",
    date: "2024-01-10",
    description: "Product Sales - DEF Inc",
    type: "credit",
    amount: 22000,
    balance: 170000,
    category: "Income",
    account: "GCB Bank - 1234567890",
    status: "completed",
    reference: "TXN001229",
  },
  {
    id: "7",
    date: "2024-01-09",
    description: "Utilities Payment",
    type: "debit",
    amount: 1200,
    balance: 148000,
    category: "Utilities",
    account: "Ecobank - 0987654321",
    status: "completed",
    reference: "TXN001228",
  },
  {
    id: "8",
    date: "2024-01-08",
    description: "Marketing Campaign",
    type: "debit",
    amount: 8000,
    balance: 149200,
    category: "Marketing",
    account: "GCB Bank - 1234567890",
    status: "completed",
    reference: "TXN001227",
  },
];

interface TransactionsListProps {
  organizationId: string;
  userId: string;
}

export default function TransactionsList({ organizationId, userId }: TransactionsListProps) {
  const [transactions] = useState(mockTransactions);

  const totalIncome = transactions
    .filter(t => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const filterGroups = [
    {
      id: "type",
      label: "Type",
      options: [
        { _id: "credit", label: "Income" },
        { _id: "debit", label: "Expenses" },
      ],
    },
    {
      id: "status",
      label: "Status",
      options: [
        { _id: "completed", label: "Completed" },
        { _id: "pending", label: "Pending" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              GHS {totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter(t => t.type === "credit").length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              GHS {totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter(t => t.type === "debit").length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {(totalIncome - totalExpenses).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">This period</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            searchKey="description"
            filterGroups={filterGroups}
          />
        </CardContent>
      </Card>
    </div>
  );
}
