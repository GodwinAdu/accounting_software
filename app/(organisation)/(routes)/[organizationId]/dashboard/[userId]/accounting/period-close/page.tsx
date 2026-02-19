import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { getPeriodCloseData } from "@/lib/actions/period-close.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function PeriodClosePage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("periodClose_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getPeriodCloseData();
  if (!result.success) {
    return <div>Error loading data</div>;
  }

  const { tasks, completedTasks, pendingTasks, canClose, postedEntriesCount, reconciledAccountsCount, unreconciledCount } = result.data;
  const currentPeriod = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <Heading title="Period Close" description="Close accounting periods and lock transactions" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPeriod}</div>
            <Badge variant="secondary" className="mt-2">Open</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Periods</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">Before closing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">This period</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Period Close Checklist</CardTitle>
          <Button size="sm" disabled={!canClose}>
            <Lock className="h-4 w-4 mr-2" />
            Close Period
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`h-5 w-5 ${task.completed ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                </div>
                <Badge variant={task.completed ? "default" : "outline"}>
                  {task.completed ? "Complete" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Period Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Journal Entries</p>
              <p className="text-2xl font-bold mt-1">{postedEntriesCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Posted this period</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Bank Reconciliations</p>
              <p className="text-2xl font-bold mt-1">{reconciledAccountsCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Completed this period</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Unreconciled Items</p>
              <p className="text-2xl font-bold mt-1">{unreconciledCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
