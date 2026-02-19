"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Link2, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BankFeedsListProps {
  organizationId: string;
  userId: string;
  accounts: any[];
}

export default function BankFeedsList({ organizationId, userId, accounts }: BankFeedsListProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Bank Feed Integration Coming Soon!</strong> Direct bank connections with Ghana banks (GCB, Ecobank, Stanbic, etc.) are under development. 
          For now, you can manually add transactions in the Transactions page.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Bank accounts added</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">0</div>
            <p className="text-xs text-muted-foreground mt-1">Auto-sync enabled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{accounts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting connection</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bank Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No bank accounts yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add bank accounts first to enable automatic transaction feeds
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Add Bank Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <Card key={account._id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="rounded-full p-3 bg-blue-100">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{account.bankName}</h3>
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              <Clock className="h-3 w-3 mr-1" />
                              Not Connected
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{account.accountName}</p>
                          <p className="text-sm font-mono">{account.accountNumber}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Bank feed integration will be available soon. Manual transaction entry is currently supported.
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" disabled>
                        <Link2 className="h-4 w-4 mr-2" />
                        Connect (Coming Soon)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Upcoming Bank Feed Features</h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Direct API integration with major Ghana banks (GCB, Ecobank, Stanbic, Absa, Fidelity)</li>
                <li>Automatic daily transaction imports</li>
                <li>Real-time balance updates</li>
                <li>Smart transaction categorization</li>
                <li>Duplicate detection and matching</li>
                <li>Secure OAuth 2.0 authentication</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
