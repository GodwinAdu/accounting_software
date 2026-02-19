"use client";

import { Plus, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import TransferDialog from "./transfer-dialog";

interface TransfersListProps {
  accounts: any[];
  hasCreatePermission: boolean;
}

export default function TransfersList({ accounts, hasCreatePermission }: TransfersListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeAccounts = accounts.filter(a => a.status === "active");
  const totalBalance = activeAccounts.reduce((sum, a) => sum + (a.currentBalance || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAccounts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Available for transfers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Transfer</CardTitle>
          </CardHeader>
          <CardContent>
            {hasCreatePermission && (
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setDialogOpen(true)}>
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                New Transfer
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transfer Funds</CardTitle>
            {hasCreatePermission && (
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Transfer
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ArrowLeftRight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Transfer funds between your bank accounts</p>
            {hasCreatePermission && (
              <Button onClick={() => setDialogOpen(true)}>Create Your First Transfer</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <TransferDialog open={dialogOpen} onOpenChange={setDialogOpen} accounts={activeAccounts} />
    </div>
  );
}
