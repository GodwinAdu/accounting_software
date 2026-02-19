import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Calendar, BarChart3 } from "lucide-react";
import { getBudgetForecasting } from "@/lib/actions/budget.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function ForecastingPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("forecasting_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const { summary, scenarios } = await getBudgetForecasting();
  const { projectedRevenue, projectedExpenses, projectedProfit, avgMonthlyRevenue } = summary;

  return (
    <div className="space-y-6">
      <Heading title="Financial Forecasting" description="Financial forecasting and scenario planning" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {projectedRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Next 12 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">GHS {projectedExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Next 12 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Profit</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${projectedProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              GHS {Math.abs(projectedProfit).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Net projection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {avgMonthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Revenue</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Forecast Scenarios</CardTitle>
          <Button size="sm">Create Scenario</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarios.map((scenario: any) => (
              <div key={scenario.name} className={`p-4 border rounded-lg ${scenario.name === 'Base' ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{scenario.name} Scenario</h3>
                  <span className="text-sm text-muted-foreground">
                    {scenario.name === 'Conservative' ? '-10% growth' : scenario.name === 'Base' ? 'Current trend' : '+20% growth'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-medium">GHS {scenario.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expenses</p>
                    <p className="font-medium">GHS {scenario.expenses.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profit</p>
                    <p className="font-medium">GHS {scenario.profit.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
