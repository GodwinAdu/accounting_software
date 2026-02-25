import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Check, ExternalLink } from "lucide-react";
import { getEmployees } from "@/lib/actions/employee.action";
import { ClockInOut } from "../time-tracking/_components/clock-in-out";
import Link from "next/link";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function EmployeePortalPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("employeePortal_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const employeesResult = await getEmployees();
  const employees = employeesResult.data || [];
  const currentEmployee = employees.find((e: any) => e.userId?._id === userId);

  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/employee-portal/${organizationId}`;

  return (
    <div className="space-y-6">
      <Heading title="Employee Portal" description="Self-service portal for employees" />
      <Separator />
    
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portal Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Active</div>
            <p className="text-xs text-muted-foreground mt-1">Employees can access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">With portal access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portal Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portal Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Employee Portal</Label>
              <p className="text-sm text-muted-foreground">Allow employees to access their portal</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div>
            <Label>Portal URL</Label>
            <div className="flex gap-2 mt-2">
              <Input value={portalUrl} readOnly />
              <Link href={`/employee-portal/${organizationId}`} target="_blank">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Share this URL with your employees to access their portal
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Portal Features</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">View Payslips</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Request Leave</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Submit Timesheets</span>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Update Personal Info</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
