import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { getBudgetVariance } from "@/lib/actions/budget.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function BudgetVariancePage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("budgetVariance_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const { budgets, summary } = await getBudgetVariance();
  const { totalVariance, favorable, unfavorable, variancePercent } = summary;

  return (
    <div className="space-y-6">
      <Heading title="Budget vs Actual" description="Compare budget to actual performance" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Variance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              GHS {Math.abs(totalVariance).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalVariance >= 0 ? 'Under budget' : 'Over budget'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorable</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {favorable.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Under budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unfavorable</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">GHS {unfavorable.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Over budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance %</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{variancePercent}%</div>
            <p className="text-xs text-muted-foreground mt-1">Overall</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Variance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active budgets to analyze</p>
              <p className="text-sm text-muted-foreground mt-2">Create budgets to track variance</p>
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map((budget: any) => {
                const variance = budget.totalBudgeted - budget.totalActual;
                const varPercent = budget.totalBudgeted > 0 ? ((variance / budget.totalBudgeted) * 100).toFixed(1) : "0.0";
                const isFavorable = variance >= 0;
                return (
                  <div key={budget._id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{budget.name}</h3>
                        <p className="text-sm text-muted-foreground">{budget.type} budget</p>
                      </div>
                      <Badge variant={isFavorable ? "default" : "destructive"}>
                        {isFavorable ? 'Favorable' : 'Unfavorable'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Budgeted</p>
                        <p className="font-medium">GHS {budget.totalBudgeted.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Actual</p>
                        <p className="font-medium">GHS {budget.totalActual.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Variance</p>
                        <p className={`font-medium ${isFavorable ? 'text-emerald-600' : 'text-red-600'}`}>
                          GHS {Math.abs(variance).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Variance %</p>
                        <p className={`font-medium ${isFavorable ? 'text-emerald-600' : 'text-red-600'}`}>
                          {varPercent}%
                        </p>
                      </div>
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
