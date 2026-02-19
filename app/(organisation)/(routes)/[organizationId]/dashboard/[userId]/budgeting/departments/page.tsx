import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, DollarSign, TrendingDown, Users } from "lucide-react";
import { getDepartmentBudgets } from "@/lib/actions/budget.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function DepartmentBudgetsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("departmentBudgets_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const { budgets, departments, summary } = await getDepartmentBudgets();
  const { totalDepartments, totalAllocated, totalSpent, overBudget } = summary;

  return (
    <div className="space-y-6">
      <Heading title="Department Budgets" description="Budget planning by department" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
            <p className="text-xs text-muted-foreground mt-1">With budgets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Allocated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalAllocated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Over Budget</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overBudget}</div>
            <p className="text-xs text-muted-foreground mt-1">Departments</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Department Budgets</CardTitle>
          <Button size="sm">Allocate Budget</Button>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No department budgets allocated</p>
              <p className="text-sm text-muted-foreground mt-2">Start allocating budgets to departments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map((budget: any) => {
                const utilization = budget.totalBudgeted > 0 ? ((budget.totalActual / budget.totalBudgeted) * 100).toFixed(1) : "0.0";
                const isOverBudget = budget.totalActual > budget.totalBudgeted;
                return (
                  <div key={budget._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{budget.departmentId?.name || "Unknown Department"}</p>
                        <p className="text-sm text-muted-foreground">
                          Budget: GHS {budget.totalBudgeted.toLocaleString()} • Spent: GHS {budget.totalActual.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                          {utilization}% utilized
                        </p>
                        <p className="text-xs text-muted-foreground">
                          GHS {(budget.totalBudgeted - budget.totalActual).toLocaleString()} remaining
                        </p>
                      </div>
                      <Badge variant={isOverBudget ? "destructive" : "default"}>
                        {isOverBudget ? "Over Budget" : "On Track"}
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
