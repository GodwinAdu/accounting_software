import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getProfitLoss } from "@/lib/actions/report.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { redirect } from "next/navigation";

export default async function ProfitLossPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("reports_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getProfitLoss();
  const data = result.data || {};

  const {
    revenue = [],
    expenses = [],
    totalRevenue = 0,
    totalExpenses = 0,
    netIncome = 0,
  } = data;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Profit & Loss Statement"
          description="Income statement showing revenue and expenses"
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
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {revenue.map((item: any, i: number) => (
                <div key={i} className="flex justify-between py-2" style={{ paddingLeft: `${item.level * 20}px` }}>
                  <span className={item.level > 0 ? "text-muted-foreground" : "font-medium"}>{item.name}</span>
                  <span className="font-medium">GHS {item.amount.toLocaleString()}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total Revenue</span>
                <span className="text-emerald-600">GHS {totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expenses.map((item: any, i: number) => (
                <div key={i} className="flex justify-between py-2" style={{ paddingLeft: `${item.level * 20}px` }}>
                  <span className={item.level > 0 ? "text-muted-foreground" : "font-medium"}>{item.name}</span>
                  <span className="font-medium">GHS {item.amount.toLocaleString()}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between py-2 font-bold text-lg">
                <span>Total Expenses</span>
                <span className="text-red-600">GHS {totalExpenses.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-600">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">Net Income</span>
              <span className={`text-3xl font-bold ${netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                GHS {netIncome.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {netIncome >= 0 ? 'Profit' : 'Loss'} for the period
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
