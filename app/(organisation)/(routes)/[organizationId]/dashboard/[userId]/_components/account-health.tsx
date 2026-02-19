"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface AccountHealthProps {
  accountHealth: {
    totalAssets: number;
    totalLiabilities: number;
    equity: number;
  };
}

export default function AccountHealth({ accountHealth }: AccountHealthProps) {
  const profitMargin = accountHealth.totalAssets > 0 
    ? ((accountHealth.equity / accountHealth.totalAssets) * 100).toFixed(1)
    : "0.0";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-emerald-100">
                <Activity className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Assets</p>
                <p className="text-xs text-muted-foreground">Current asset value</p>
              </div>
            </div>
            <p className="text-lg font-bold">GHS {accountHealth.totalAssets.toLocaleString()}</p>
          </div>
          <Progress value={85} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-orange-100">
                <TrendingDown className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Liabilities</p>
                <p className="text-xs text-muted-foreground">Outstanding obligations</p>
              </div>
            </div>
            <p className="text-lg font-bold">GHS {accountHealth.totalLiabilities.toLocaleString()}</p>
          </div>
          <Progress value={60} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-blue-100">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Equity</p>
                <p className="text-xs text-muted-foreground">Net worth percentage</p>
              </div>
            </div>
            <p className="text-lg font-bold">{profitMargin}%</p>
          </div>
          <Progress value={parseFloat(profitMargin)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
