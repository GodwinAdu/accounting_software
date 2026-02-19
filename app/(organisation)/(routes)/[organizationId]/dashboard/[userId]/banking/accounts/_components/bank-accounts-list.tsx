"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Trash2, Edit, Eye, EyeOff, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddBankAccountDialog } from "./add-bank-account-dialog";

interface BankAccountsListProps {
  organizationId: string;
  userId: string;
  accounts: any[];
  summary: any;
}

export default function BankAccountsList({ organizationId, userId, accounts, summary }: BankAccountsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showBalances, setShowBalances] = useState(true);

  const getAccountTypeLabel = (type: string) => {
    const labels: any = {
      checking: "Checking Account",
      savings: "Savings Account",
      "credit-card": "Credit Card",
      "money-market": "Money Market",
      other: "Other",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance (GHS)</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowBalances(!showBalances)}
            >
              {showBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showBalances ? `GHS ${summary.totalBalance.toLocaleString()}` : "••••••"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across {accounts.filter((a: any) => a.currency === "GHS").length} accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.activeAccounts}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of {summary.totalAccounts} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Synced</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground mt-1">All accounts up to date</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bank Accounts</CardTitle>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No bank accounts yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Add your first bank account to get started</p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Bank Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((account: any) => (
                <Card key={account._id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="rounded-full p-3 bg-blue-100">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{account.bankName}</h3>
                            {account.isPrimary && (
                              <Badge className="bg-emerald-100 text-emerald-700">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Primary
                              </Badge>
                            )}
                            {account.isActive ? (
                              <Badge variant="secondary">Active</Badge>
                            ) : (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                            <Badge variant="outline">{account.currency}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{account.accountName}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-mono">{account.accountNumber}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">{getAccountTypeLabel(account.accountType)}</span>
                          </div>
                          {account.bankBranch && <p className="text-xs text-muted-foreground">{account.bankBranch}</p>}
                          <div className="flex items-center gap-4 pt-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Current Balance</p>
                              <p className="text-lg font-bold text-emerald-600">
                                {showBalances ? `${account.currency} ${account.currentBalance.toLocaleString()}` : "••••••"}
                              </p>
                            </div>
                            {account.lastReconciledDate && (
                              <div>
                                <p className="text-xs text-muted-foreground">Last Reconciled</p>
                                <p className="text-sm">{new Date(account.lastReconciledDate).toLocaleDateString("en-GB")}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddBankAccountDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
