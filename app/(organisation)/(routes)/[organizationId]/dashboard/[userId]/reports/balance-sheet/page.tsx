import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getBalanceSheet } from "@/lib/actions/report.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { redirect } from "next/navigation";

export default async function BalanceSheetPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("reports_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getBalanceSheet();
  const data = result.data || {};

  const {
    currentAssets = [],
    fixedAssets = [],
    currentLiabilities = [],
    longTermLiabilities = [],
    equity = [],
    totalCurrentAssets = 0,
    totalFixedAssets = 0,
    totalAssets = 0,
    totalCurrentLiabilities = 0,
    totalLongTermLiabilities = 0,
    totalLiabilities = 0,
    totalEquity = 0,
  } = data;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Balance Sheet"
          description="Statement of financial position"
        />
        <div className="flex gap-3">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Separator />

      <div className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Current Assets</h4>
                <div className="space-y-2 ml-4">
                  {currentAssets.map((asset: any, i: number) => (
                    <div key={i} className="flex justify-between py-1">
                      <span>{asset.name}</span>
                      <span className="font-medium">GHS {asset.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1 font-semibold border-t pt-2">
                    <span>Total Current Assets</span>
                    <span>GHS {totalCurrentAssets.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Fixed Assets</h4>
                <div className="space-y-2 ml-4">
                  {fixedAssets.map((asset: any, i: number) => (
                    <div key={i} className="flex justify-between py-1">
                      <span>{asset.name}</span>
                      <span className="font-medium">GHS {asset.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1 font-semibold border-t pt-2">
                    <span>Total Fixed Assets</span>
                    <span>GHS {totalFixedAssets.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />
              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total Assets</span>
                <span className="text-emerald-600">GHS {totalAssets.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Current Liabilities</h4>
                <div className="space-y-2 ml-4">
                  {currentLiabilities.map((liability: any, i: number) => (
                    <div key={i} className="flex justify-between py-1">
                      <span>{liability.name}</span>
                      <span className="font-medium">GHS {liability.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1 font-semibold border-t pt-2">
                    <span>Total Current Liabilities</span>
                    <span>GHS {totalCurrentLiabilities.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Long-term Liabilities</h4>
                <div className="space-y-2 ml-4">
                  {longTermLiabilities.map((liability: any, i: number) => (
                    <div key={i} className="flex justify-between py-1">
                      <span>{liability.name}</span>
                      <span className="font-medium">GHS {liability.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1 font-semibold border-t pt-2">
                    <span>Total Long-term Liabilities</span>
                    <span>GHS {totalLongTermLiabilities.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />
              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total Liabilities</span>
                <span className="text-red-600">GHS {totalLiabilities.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {equity.map((eq: any, i: number) => (
                <div key={i} className="flex justify-between py-1">
                  <span>{eq.name}</span>
                  <span className="font-medium">GHS {eq.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold text-lg border-t pt-2">
                <span>Total Equity</span>
                <span className="text-blue-600">GHS {totalEquity.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-600">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total Liabilities & Equity</span>
              <span className="text-2xl font-bold text-emerald-600">
                GHS {(totalLiabilities + totalEquity).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Assets = Liabilities + Equity: {Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01 ? '✓ Balanced' : '✗ Not Balanced'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
