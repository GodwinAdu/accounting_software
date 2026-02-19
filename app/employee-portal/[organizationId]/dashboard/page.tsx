import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { connectToDB } from "@/lib/connection/mongoose";
import Organization from "@/lib/models/organization.model";
import User from "@/lib/models/user.model";
import Employee from "@/lib/models/employee.model";
import PayrollRun from "@/lib/models/payroll-run.model";
import LeaveRequest from "@/lib/models/leave-request.model";
import EmployeeHeader from "../_components/employee-header";
import EmployeePayslipsList from "../_components/employee-payslips-list";
import EmployeeLeaveRequests from "../_components/employee-leave-requests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = Promise<{ organizationId: string }>;

export default async function EmployeeDashboardPage({ params, searchParams }: { params: Props; searchParams: Promise<{ email?: string }> }) {
  const { organizationId } = await params;
  const { email } = await searchParams;

  if (!email) redirect(`/employee-portal/${organizationId}`);

  await connectToDB();
  const organization = await Organization.findById(organizationId);
  const user = await User.findOne({ organizationId, email, del_flag: false });

  if (!organization || !user) {
    redirect(`/employee-portal/${organizationId}`);
  }

  const employee = await Employee.findOne({ organizationId, userId: user._id, del_flag: false });

  if (!employee) {
    redirect(`/employee-portal/${organizationId}`);
  }

  const payrollRuns = await PayrollRun.find({ 
    organizationId, 
    "employeePayments.employeeId": employee._id,
    del_flag: false 
  }).sort({ payDate: -1 }).lean();

  const payslips = payrollRuns.map(run => {
    const payment = run.employeePayments.find(p => p.employeeId.toString() === employee._id.toString());
    return {
      _id: run._id,
      payPeriod: run.payPeriod,
      payDate: run.payDate,
      status: run.status,
      grossPay: payment?.grossPay || 0,
      totalDeductions: payment?.totalDeductions || 0,
      netPay: payment?.netPay || 0,
    };
  });

  const leaveRequests = await LeaveRequest.find({ 
    organizationId, 
    employeeId: employee._id,
    del_flag: false 
  }).sort({ createdAt: -1 }).lean();

  const totalEarnings = payslips.reduce((sum, p) => sum + p.grossPay, 0);
  const totalDeductions = payslips.reduce((sum, p) => sum + p.totalDeductions, 0);
  const approvedLeaves = leaveRequests.filter(l => l.status === "approved").length;
  const pendingLeaves = leaveRequests.filter(l => l.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeHeader 
        organization={JSON.parse(JSON.stringify(organization))} 
        employee={JSON.parse(JSON.stringify(employee))}
        user={JSON.parse(JSON.stringify(user))}
        organizationId={organizationId} 
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GHS {totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{payslips.length} payslips</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">GHS {totalDeductions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{approvedLeaves}</div>
              <p className="text-xs text-muted-foreground mt-1">This year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLeaves}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="payslips" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payslips">Payslips</TabsTrigger>
            <TabsTrigger value="leave">Leave Requests</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="payslips">
            <EmployeePayslipsList payslips={JSON.parse(JSON.stringify(payslips))} />
          </TabsContent>

          <TabsContent value="leave">
            <EmployeeLeaveRequests leaveRequests={JSON.parse(JSON.stringify(leaveRequests))} />
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Employee Number</p>
                      <p className="font-medium">{employee.employeeNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{employee.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Position</p>
                      <p className="font-medium">{employee.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Employment Type</p>
                      <p className="font-medium capitalize">{employee.employmentType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{user.phone || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
