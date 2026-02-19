import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { getProjectBudgets } from "@/lib/actions/project.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function ProjectBudgetsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("projectBudgets_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const { projects, summary } = await getProjectBudgets();
  const { totalBudget, totalSpent, remaining, overBudget } = summary;

  return (
    <div className="space-y-6">
      <Heading title="Project Budgets" description="Set and monitor project budgets" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Allocated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">GHS {totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Actual cost</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {remaining.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Over Budget</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overBudget}</div>
            <p className="text-xs text-muted-foreground mt-1">Projects</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Budgets</CardTitle>
          <Button size="sm">Set Budget</Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No project budgets</p>
              <p className="text-sm text-muted-foreground mt-2">Set budgets for your projects</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project: any) => {
                const variance = project.budget - project.actualCost;
                const progress = project.budget > 0 ? ((project.actualCost / project.budget) * 100).toFixed(0) : "0";
                const isOverBudget = project.actualCost > project.budget;
                return (
                  <div key={project._id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">Manager: {project.managerId?.name}</p>
                      </div>
                      <Badge variant={isOverBudget ? "destructive" : "default"}>
                        {isOverBudget ? "Over Budget" : "On Track"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">GHS {project.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Spent</p>
                        <p className="font-medium">GHS {project.actualCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Variance</p>
                        <p className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                          GHS {Math.abs(variance).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">{progress}%</p>
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
