import Link from "next/link";
import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, DollarSign, TrendingUp, CheckCircle } from "lucide-react";
import { getAllProjects } from "@/lib/actions/project.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function ProjectsAllPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("projects_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const { projects, summary } = await getAllProjects();
  const { totalProjects, totalBudget, totalCost, totalRevenue, activeProjects } = summary;

  return (
    <div className="space-y-6">
      <Heading title="Projects" description="Manage projects and track profitability" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">{activeProjects} active</p>
          </CardContent>
        </Card>

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
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">GHS {totalCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Earned</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Projects</CardTitle>
          <Link href={`/${organizationId}/dashboard/${userId}/projects/all/new`}>
            <Button size="sm">Create Project</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No projects created</p>
              <p className="text-sm text-muted-foreground mt-2">Start tracking your projects</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project: any) => {
                const progress = project.budget > 0 ? ((project.actualCost / project.budget) * 100).toFixed(0) : "0";
                return (
                  <Link key={project._id} href={`/${organizationId}/dashboard/${userId}/projects/all/${project._id}`}>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {project.projectNumber} • Manager: {project.managerId?.name || "Unassigned"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">GHS {project.actualCost.toLocaleString()} / {project.budget.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{progress}% spent</p>
                      </div>
                      <Badge variant={project.status === "active" ? "default" : "outline"}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
