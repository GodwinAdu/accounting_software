"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";

interface EquityListProps {
  transactions: any[];
  hasCreatePermission: boolean;
}

export function EquityList({ transactions, hasCreatePermission }: EquityListProps) {
  const router = useRouter();

  const totalInvestments = transactions
    .filter(t => t.transactionType === "investment")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDrawings = transactions
    .filter(t => t.transactionType === "drawing")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDividends = transactions
    .filter(t => t.transactionType === "dividend")
    .reduce((sum, t) => sum + t.amount, 0);

  const netEquity = totalInvestments - totalDrawings - totalDividends;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              GHS {totalInvestments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Owner contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drawings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              GHS {totalDrawings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Owner withdrawals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dividends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              GHS {totalDividends.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Profit distributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Equity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {netEquity.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Equity Transactions</CardTitle>
          </div>
          {hasCreatePermission && (
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("./all/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            searchKey="ownerName"
          />
        </CardContent>
      </Card>
    </div>
  );
}
