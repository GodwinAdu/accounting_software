"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface VATReturnClientProps {
  data: any;
  organizationId: string;
  userId: string;
}

export default function VATReturnClient({ data, organizationId, userId }: VATReturnClientProps) {
  const handleDownloadCSV = () => {
    const csvContent = [
      ["VAT Return Report"],
      [""],
      ["Summary"],
      ["Output VAT (Sales)", data.outputVAT.toFixed(2)],
      ["Input VAT (Purchases)", data.inputVAT.toFixed(2)],
      ["Net VAT", data.netVAT.toFixed(2)],
      ["Status", data.netVAT > 0 ? "Payable to GRA" : "Receivable from GRA"],
      [""],
      ["Sales by Tax Rate"],
      ["Rate", "Amount", "VAT"],
      ...data.salesByRate.map((s: any) => [s.rate + "%", s.amount.toFixed(2), s.vat.toFixed(2)]),
      [""],
      ["Purchases by Tax Rate"],
      ["Rate", "Amount", "VAT"],
      ...data.purchasesByRate.map((p: any) => [p.rate + "%", p.amount.toFixed(2), p.vat.toFixed(2)]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vat-return-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">VAT Return</h1>
          <p className="text-muted-foreground">Value Added Tax return summary</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownloadCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
          <Link href={`/${organizationId}/dashboard/${userId}/tax/settings`}>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Tax Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Output VAT</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {data.outputVAT.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">VAT on Sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Input VAT</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">GHS {data.inputVAT.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">VAT on Purchases</p>
          </CardContent>
        </Card>

        <Card className={data.netVAT > 0 ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net VAT</CardTitle>
            {data.netVAT > 0 ? (
              <TrendingUp className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-emerald-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.netVAT > 0 ? "text-red-600" : "text-emerald-600"}`}>
              GHS {Math.abs(data.netVAT).toLocaleString()}
            </div>
            <Badge className={`mt-2 ${data.netVAT > 0 ? "bg-red-600" : "bg-emerald-600"}`}>
              {data.netVAT > 0 ? "Payable to GRA" : "Receivable from GRA"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Tax Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.salesByRate.length > 0 ? (
                data.salesByRate.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.rate}% VAT</p>
                      <p className="text-sm text-muted-foreground">Sales Amount: GHS {item.amount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">GHS {item.vat.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Output VAT</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchases by Tax Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.purchasesByRate.length > 0 ? (
                data.purchasesByRate.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.rate}% VAT</p>
                      <p className="text-sm text-muted-foreground">Purchase Amount: GHS {item.amount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">GHS {item.vat.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Input VAT</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No purchase data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>VAT Calculation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Total Sales (Taxable)</span>
              <span>GHS {data.salesByRate.reduce((sum: number, s: any) => sum + s.amount, 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Output VAT Collected</span>
              <span className="text-emerald-600">GHS {data.outputVAT.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Total Purchases (Taxable)</span>
              <span>GHS {data.purchasesByRate.reduce((sum: number, p: any) => sum + p.amount, 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Input VAT Paid</span>
              <span className="text-blue-600">GHS {data.inputVAT.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between py-3 bg-gray-50 dark:bg-gray-900 px-4 rounded-lg">
              <span className="text-lg font-bold">Net VAT Position</span>
              <span className={`text-lg font-bold ${data.netVAT > 0 ? "text-red-600" : "text-emerald-600"}`}>
                GHS {Math.abs(data.netVAT).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              {data.netVAT > 0 
                ? "You owe this amount to Ghana Revenue Authority (GRA)" 
                : "GRA owes you this amount as a refund"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
