import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { connectToDB } from "@/lib/connection/mongoose";
import Organization from "@/lib/models/organization.model";
import User from "@/lib/models/user.model";
import Employee from "@/lib/models/employee.model";
import PayrollRun from "@/lib/models/payroll-run.model";
import LeaveRequest from "@/lib/models/leave-request.model";
import TimeEntry from "@/lib/models/time-entry.model";
import EmployeeLoan from "@/lib/models/employee-loan.model";
import EmployeeHeader from "../_components/employee-header";
import EmployeePayslipsList from "../_components/employee-payslips-list";
import EmployeeLeaveRequests from "../_components/employee-leave-requests";
import EmployeeLoans from "../_components/employee-loans";
import { ClockInOut } from "@/app/(organisation)/(routes)/[organizationId]/dashboard/[userId]/payroll/time-tracking/_components/clock-in-out";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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

  const timeEntries = await TimeEntry.find({
    organizationId,
    employeeId: employee._id,
    del_flag: false
  }).sort({ date: -1, clockIn: -1 }).limit(30).lean();

  const loans = await EmployeeLoan.find({
    organizationId,
    employeeId: employee._id,
    del_flag: false
  }).sort({ createdAt: -1 }).lean();

  console.log("Loans fetched:", loans.length, "for employee:", employee._id.toString());
  console.log("Loans data:", JSON.stringify(loans, null, 2));

  const totalEarnings = payslips.reduce((sum, p) => sum + p.grossPay, 0);
  const totalDeductions = payslips.reduce((sum, p) => sum + p.totalDeductions, 0);
  const approvedLeaves = leaveRequests.filter(l => l.status === "approved").length;
  const pendingLeaves = leaveRequests.filter(l => l.status === "pending").length;
  const totalHoursWorked = timeEntries.reduce((sum, e) => sum + (e.totalHours || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeHeader 
        organization={JSON.parse(JSON.stringify(organization))} 
        employee={JSON.parse(JSON.stringify(employee))}
        user={JSON.parse(JSON.stringify(user))}
        organizationId={organizationId} 
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="max-w-md">
          <ClockInOut employeeId={employee._id.toString()} />
        </div>

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

        <Tabs defaultValue="time" className="space-y-4">
          <TabsList>
            <TabsTrigger value="time">Time History</TabsTrigger>
            <TabsTrigger value="payslips">Payslips</TabsTrigger>
            <TabsTrigger value="leave">Leave Requests</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="time">
            <Card>
              <CardHeader>
                <CardTitle>My Time History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-left font-medium">Date</th>
                          <th className="p-3 text-left font-medium">Clock In</th>
                          <th className="p-3 text-left font-medium">Clock Out</th>
                          <th className="p-3 text-right font-medium">Hours</th>
                          <th className="p-3 text-center font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeEntries.map((entry: any) => {
                          const statusConfig = {
                            pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
                            approved: { label: "Approved", className: "bg-emerald-100 text-emerald-700" },
                            rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
                          };
                          const config = statusConfig[entry.status as keyof typeof statusConfig];
                          return (
                            <tr key={entry._id.toString()} className="border-b">
                              <td className="p-3">{new Date(entry.date).toLocaleDateString()}</td>
                              <td className="p-3">{new Date(entry.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                              <td className="p-3">{entry.clockOut ? new Date(entry.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--"}</td>
                              <td className="p-3 text-right font-medium">{entry.totalHours?.toFixed(1) || 0}h</td>
                              <td className="p-3 text-center">
                                <Badge className={config.className}>{config.label}</Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Total Hours Worked: <span className="font-bold text-emerald-600">{totalHoursWorked.toFixed(1)}h</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payslips">
            <EmployeePayslipsList payslips={JSON.parse(JSON.stringify(payslips))} />
          </TabsContent>

          <TabsContent value="leave">
            <EmployeeLeaveRequests leaveRequests={JSON.parse(JSON.stringify(leaveRequests))} employeeId={employee._id.toString()} />
          </TabsContent>

          <TabsContent value="loans">
            <EmployeeLoans loans={JSON.parse(JSON.stringify(loans))} employeeId={employee._id.toString()} />
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
