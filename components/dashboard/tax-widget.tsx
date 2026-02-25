"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

interface TaxWidgetProps {
  vatPayable: number;
  vatReceivable: number;
  netVAT: number;
  organizationId: string;
  userId: string;
}

export function TaxWidget({ vatPayable, vatReceivable, netVAT, organizationId, userId }: TaxWidgetProps) {
  return (
    <Link href={`/${organizationId}/dashboard/${userId}/tax/sales-tax`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">VAT Position</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Output VAT</span>
              <span className="text-sm font-medium">GHS {vatPayable.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Input VAT</span>
              <span className="text-sm font-medium">GHS {vatReceivable.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Net VAT</span>
                <div className="flex items-center gap-1">
                  {netVAT > 0 ? (
                    <TrendingUp className="h-3 w-3 text-red-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-emerald-600" />
                  )}
                  <span className={`text-lg font-bold ${netVAT > 0 ? "text-red-600" : "text-emerald-600"}`}>
                    GHS {Math.abs(netVAT).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {netVAT > 0 ? "Payable to GRA" : "Receivable from GRA"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
