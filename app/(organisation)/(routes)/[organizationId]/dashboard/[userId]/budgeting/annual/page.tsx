import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { getAnnualBudgets } from "@/lib/actions/budget.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function AnnualBudgetPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("annualBudget_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const { budgets, summary } = await getAnnualBudgets();
  const { totalBudgeted, totalActual, totalVariance, activeBudgets } = summary;
  const variancePercent = totalBudgeted > 0 ? ((totalVariance / totalBudgeted) * 100).toFixed(1) : "0.0";
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <Heading title="Annual Budget" description="Create and manage annual budgets" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalBudgeted.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{currentYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actual Spend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalActual.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              GHS {Math.abs(totalVariance).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{variancePercent}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Budgets</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBudgets}</div>
            <p className="text-xs text-muted-foreground mt-1">This year</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Annual Budgets</CardTitle>
          <Button size="sm">Create Budget</Button>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No annual budgets created</p>
              <p className="text-sm text-muted-foreground mt-2">Create your first annual budget</p>
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map((budget: any) => {
                const variance = budget.totalBudgeted - budget.totalActual;
                const varPercent = budget.totalBudgeted > 0 ? ((variance / budget.totalBudgeted) * 100).toFixed(1) : "0.0";
                return (
                  <div key={budget._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{budget.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Budgeted: GHS {budget.totalBudgeted.toLocaleString()} • Actual: GHS {budget.totalActual.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`text-sm font-medium ${variance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {variance >= 0 ? '+' : '-'}GHS {Math.abs(variance).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{varPercent}% variance</p>
                      </div>
                      <Badge variant={budget.status === "active" ? "default" : "outline"}>
                        {budget.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
