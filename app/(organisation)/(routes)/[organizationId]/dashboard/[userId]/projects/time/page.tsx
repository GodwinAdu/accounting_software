import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { getProjectTime } from "@/lib/actions/project.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function ProjectTimePage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("projectTime_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const { timeEntries, summary } = await getProjectTime();
  const { totalHours, billableHours, totalAmount, pendingApproval } = summary;

  return (
    <div className="space-y-6">
      <Heading title="Project Time Tracking" description="Track time spent on projects" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">All time entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{billableHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">Can be invoiced</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingApproval}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Time Entries</CardTitle>
          <Button size="sm">Log Time</Button>
        </CardHeader>
        <CardContent>
          {timeEntries.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No time entries logged</p>
              <p className="text-sm text-muted-foreground mt-2">Start tracking time on projects</p>
            </div>
          ) : (
            <div className="space-y-3">
              {timeEntries.map((entry: any) => (
                <div key={entry._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{entry.projectId?.name || "Unknown Project"}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.userId?.name} • {new Date(entry.date).toLocaleDateString()} • {entry.description || "No description"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{entry.hours}h @ GHS {entry.hourlyRate}/hr</p>
                      <p className="text-xs text-muted-foreground">GHS {entry.amount.toLocaleString()}</p>
                    </div>
                    <Badge variant={entry.billable ? "default" : "outline"}>
                      {entry.billable ? "Billable" : "Non-billable"}
                    </Badge>
                    <Badge variant={entry.status === "approved" ? "default" : "outline"}>
                      {entry.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
