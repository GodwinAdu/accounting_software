import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, BarChart3, Percent } from "lucide-react";
import { getProjectProfitability } from "@/lib/actions/project.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function ProjectProfitabilityPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("projectProfitability_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const { projects, summary } = await getProjectProfitability();
  const { totalRevenue, totalCost, totalProfit, avgMargin } = summary;

  return (
    <div className="space-y-6">
      <Heading title="Project Profitability" description="Analyze project profitability and margins" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">GHS {totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              GHS {totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Net profit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMargin}%</div>
            <p className="text-xs text-muted-foreground mt-1">Profit margin</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Project Profitability Analysis</CardTitle>
          <Button size="sm">Export Report</Button>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No projects to analyze</p>
              <p className="text-sm text-muted-foreground mt-2">Create projects to track profitability</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project: any) => {
                const isProfitable = project.profit >= 0;
                return (
                  <div key={project._id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">Manager: {project.managerId?.name}</p>
                      </div>
                      <Badge variant={isProfitable ? "default" : "destructive"}>
                        {isProfitable ? "Profitable" : "Loss"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-medium text-emerald-600">GHS {project.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Cost</p>
                        <p className="font-medium text-orange-600">GHS {project.actualCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Profit</p>
                        <p className={`font-medium ${isProfitable ? 'text-emerald-600' : 'text-red-600'}`}>
                          GHS {project.profit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Margin</p>
                        <p className="font-medium">{project.margin}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium capitalize">{project.status}</p>
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
