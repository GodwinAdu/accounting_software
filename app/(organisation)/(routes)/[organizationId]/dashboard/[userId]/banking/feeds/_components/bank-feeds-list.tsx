"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, XCircle, RefreshCw, Settings, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Mock data
const mockBankFeeds = [
  {
    id: "1",
    bankName: "GCB Bank",
    accountNumber: "1234567890",
    accountName: "PayFlow Business Current",
    status: "connected",
    lastSync: "2024-01-15 10:30 AM",
    autoSync: true,
    transactionsImported: 245,
  },
  {
    id: "2",
    bankName: "Ecobank Ghana",
    accountNumber: "0987654321",
    accountName: "PayFlow Savings",
    status: "connected",
    lastSync: "2024-01-15 09:15 AM",
    autoSync: true,
    transactionsImported: 189,
  },
  {
    id: "3",
    bankName: "Stanbic Bank",
    accountNumber: "5555666677",
    accountName: "PayFlow USD Account",
    status: "error",
    lastSync: "2024-01-10 03:20 PM",
    autoSync: false,
    transactionsImported: 67,
  },
];

const availableBanks = [
  { id: "gcb", name: "GCB Bank", logo: "🏦", supported: true },
  { id: "ecobank", name: "Ecobank Ghana", logo: "🏦", supported: true },
  { id: "stanbic", name: "Stanbic Bank", logo: "🏦", supported: true },
  { id: "absa", name: "Absa Bank", logo: "🏦", supported: true },
  { id: "fidelity", name: "Fidelity Bank", logo: "🏦", supported: true },
  { id: "zenith", name: "Zenith Bank", logo: "🏦", supported: false },
];

interface BankFeedsListProps {
  organizationId: string;
  userId: string;
}

export default function BankFeedsList({ organizationId, userId }: BankFeedsListProps) {
  const [feeds, setFeeds] = useState(mockBankFeeds);

  const handleSync = (feedId: string) => {
    console.log("Syncing feed:", feedId);
    // Implement sync logic
  };

  const handleToggleAutoSync = (feedId: string) => {
    setFeeds(feeds.map(feed => 
      feed.id === feedId ? { ...feed, autoSync: !feed.autoSync } : feed
    ));
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feeds.filter(f => f.status === "connected").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Out of {feeds.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions Imported</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feeds.reduce((sum, f) => sum + f.transactionsImported, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Sync Enabled</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {feeds.filter(f => f.autoSync).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Accounts syncing automatically</p>
          </CardContent>
        </Card>
      </div>

      {/* Connected Feeds */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Bank Feeds</CardTitle>
          <CardDescription>Manage your connected bank accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feeds.map((feed) => (
              <Card key={feed.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="rounded-full p-3 bg-blue-100">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{feed.bankName}</h3>
                          {feed.status === "connected" ? (
                            <Badge className="bg-emerald-100 text-emerald-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Error
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{feed.accountName}</p>
                        <p className="text-sm font-mono">{feed.accountNumber}</p>
                        <div className="flex items-center gap-4 text-sm pt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Last Synced</p>
                            <p className="font-medium">{feed.lastSync}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Transactions</p>
                            <p className="font-medium">{feed.transactionsImported}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <Switch
                            checked={feed.autoSync}
                            onCheckedChange={() => handleToggleAutoSync(feed.id)}
                          />
                          <Label className="text-sm">Auto-sync daily</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSync(feed.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
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

      {/* Available Banks */}
      <Card>
        <CardHeader>
          <CardTitle>Connect New Bank</CardTitle>
          <CardDescription>Select a bank to connect your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableBanks.map((bank) => (
              <Card key={bank.id} className="cursor-pointer hover:border-emerald-600 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{bank.logo}</div>
                      <div>
                        <p className="font-semibold">{bank.name}</p>
                        {bank.supported ? (
                          <Badge variant="secondary" className="mt-1">Supported</Badge>
                        ) : (
                          <Badge variant="outline" className="mt-1">Coming Soon</Badge>
                        )}
                      </div>
                    </div>
                    {bank.supported && (
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        Connect
                      </Button>
                    )}
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
