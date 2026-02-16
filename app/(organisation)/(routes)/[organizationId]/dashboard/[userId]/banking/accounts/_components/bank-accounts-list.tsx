"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Building2, Trash2, Edit, Eye, EyeOff, Star, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockAccounts = [
  {
    id: "1",
    bankName: "GCB Bank",
    accountName: "PayFlow Business Current",
    accountNumber: "1234567890",
    accountType: "Current Account",
    currency: "GHS",
    balance: 156000,
    branch: "Accra Main Branch",
    isDefault: true,
    isActive: true,
    lastSync: "2024-01-15 10:30 AM",
  },
  {
    id: "2",
    bankName: "Ecobank Ghana",
    accountName: "PayFlow Savings",
    accountNumber: "0987654321",
    accountType: "Savings Account",
    currency: "GHS",
    balance: 85000,
    branch: "Osu Branch",
    isDefault: false,
    isActive: true,
    lastSync: "2024-01-15 09:15 AM",
  },
  {
    id: "3",
    bankName: "Stanbic Bank",
    accountName: "PayFlow USD Account",
    accountNumber: "5555666677",
    accountType: "Foreign Currency",
    currency: "USD",
    balance: 12500,
    branch: "Airport City",
    isDefault: false,
    isActive: true,
    lastSync: "2024-01-14 04:20 PM",
  },
];

interface BankAccountsListProps {
  organizationId: string;
  userId: string;
}

export default function BankAccountsList({ organizationId, userId }: BankAccountsListProps) {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showBalances, setShowBalances] = useState(true);

  const totalBalance = accounts
    .filter(acc => acc.currency === "GHS")
    .reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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
              {showBalances ? `GHS ${totalBalance.toLocaleString()}` : "••••••"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across {accounts.filter(a => a.currency === "GHS").length} accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.filter(a => a.isActive).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Out of {accounts.length} total</p>
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

      {/* Accounts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bank Accounts</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Bank Account</DialogTitle>
                  <DialogDescription>
                    Enter your bank account details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gcb">GCB Bank</SelectItem>
                        <SelectItem value="ecobank">Ecobank Ghana</SelectItem>
                        <SelectItem value="stanbic">Stanbic Bank</SelectItem>
                        <SelectItem value="absa">Absa Bank</SelectItem>
                        <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                        <SelectItem value="zenith">Zenith Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input id="accountName" placeholder="Business account name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" placeholder="1234567890" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">Current Account</SelectItem>
                        <SelectItem value="savings">Savings Account</SelectItem>
                        <SelectItem value="foreign">Foreign Currency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select defaultValue="GHS">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GHS">GHS - Ghana Cedi</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input id="branch" placeholder="e.g., Accra Main" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isDefault">Set as default</Label>
                    <Switch id="isDefault" />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      Add Account
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.map((account) => (
              <Card key={account.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="rounded-full p-3 bg-blue-100">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{account.bankName}</h3>
                          {account.isDefault && (
                            <Badge className="bg-emerald-100 text-emerald-700">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Default
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
                          <span className="text-muted-foreground">{account.accountType}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{account.branch}</p>
                        <div className="flex items-center gap-4 pt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Balance</p>
                            <p className="text-lg font-bold text-emerald-600">
                              {showBalances ? `${account.currency} ${account.balance.toLocaleString()}` : "••••••"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Last Synced</p>
                            <p className="text-sm">{account.lastSync}</p>
                          </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
