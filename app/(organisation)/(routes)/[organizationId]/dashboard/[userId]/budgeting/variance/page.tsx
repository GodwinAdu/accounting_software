import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, TrendingDown, BarChart3, Info, ChevronDown, ChevronUp } from "lucide-react";
import { getAllBudgets } from "@/lib/actions/budget.action";
import { getBudgetVsActual } from "@/lib/helpers/budget-analysis";
import BudgetVarianceClient from "./_components/budget-variance-client";

type Props = Promise<{ organizationId: string; userId: string }>;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BudgetVariancePage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("budgeting_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getAllBudgets();
  const budgets = result.success ? (result.budgets || []) : [];
  const activeBudgets = budgets.filter(b => b.status === "active");

  const budgetAnalysis = await Promise.all(
    activeBudgets.map(async (budget) => {
      const analysis = await getBudgetVsActual(budget._id);
      return analysis.success ? analysis.data : null;
    })
  );

  const validAnalysis = budgetAnalysis.filter(a => a !== null);
  
  const totalVariance = validAnalysis.reduce((sum, a) => sum + (a?.summary.totalVariance || 0), 0);
  const favorable = validAnalysis.reduce((sum, a) => {
    const variance = a?.summary.totalVariance || 0;
    return sum + (variance > 0 ? variance : 0);
  }, 0);
  const unfavorable = validAnalysis.reduce((sum, a) => {
    const variance = a?.summary.totalVariance || 0;
    return sum + (variance < 0 ? Math.abs(variance) : 0);
  }, 0);
  const totalBudgeted = validAnalysis.reduce((sum, a) => sum + (a?.summary.totalBudgeted || 0), 0);
  const variancePercent = totalBudgeted > 0 ? ((totalVariance / totalBudgeted) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      <Heading title="Budget vs Actual" description="Compare budget to actual performance" />
      <Separator />
      
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">How variance works</p>
          <p className="text-blue-700">Variance compares your budgeted amounts to actual spending from journal entries. Favorable (green) means under budget, unfavorable (red) means over budget. Click on any budget to see account-level details.</p>
        </div>
      </div>
      
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

      <BudgetVarianceClient budgets={validAnalysis} />
    </div>
  );
}
