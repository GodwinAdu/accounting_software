"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpIcon, ArrowDownIcon, Plus } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { AddTransactionDialog } from "./add-transaction-dialog";

interface TransactionsListProps {
  organizationId: string;
  userId: string;
  transactions: any[];
  accounts: any[];
}

export default function TransactionsList({ organizationId, userId, transactions, accounts }: TransactionsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const deposits = transactions.filter((t) => t.transactionType === "deposit" || t.transactionType === "interest");
  const withdrawals = transactions.filter((t) => 
    t.transactionType === "withdrawal" || t.transactionType === "fee" || t.transactionType === "transfer"
  );

  const totalIncome = deposits.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = withdrawals.reduce((sum, t) => sum + t.amount, 0);

  const filterGroups = [
    {
      id: "transactionType",
      label: "Type",
      options: [
        { _id: "deposit", label: "Deposit" },
        { _id: "withdrawal", label: "Withdrawal" },
        { _id: "transfer", label: "Transfer" },
        { _id: "fee", label: "Fee" },
        { _id: "interest", label: "Interest" },
        { _id: "other", label: "Other" },
      ],
    },
    {
      id: "isReconciled",
      label: "Status",
      options: [
        { _id: "true", label: "Reconciled" },
        { _id: "false", label: "Unreconciled" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <ArrowUpIcon className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              GHS {totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {deposits.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <ArrowDownIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              GHS {totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {withdrawals.length} transactions
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
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

      <AddTransactionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        accounts={accounts}
      />
    </div>
  );
}
