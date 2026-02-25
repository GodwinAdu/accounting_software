import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPayrollRunById } from "@/lib/actions/payroll-run.action";
import { DownloadPayrollButton } from "./_components/download-button";
import Link from "next/link";

export default async function PayrollRunDetailPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string; runId: string }>;
}) {
  const { organizationId, userId, runId } = await params;

  const result = await getPayrollRunById(runId);
  const run = result.data;

  if (!run) {
    return <div>Payroll run not found</div>;
  }

  const statusConfig = {
    draft: { label: "Draft", className: "bg-gray-100 text-gray-700" },
    processing: { label: "Processing", className: "bg-blue-100 text-blue-700" },
    completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${organizationId}/dashboard/${userId}/payroll/history`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{run.runNumber}</h1>
            <p className="text-muted-foreground">Payroll run details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={statusConfig[run.status as keyof typeof statusConfig].className}>
            {statusConfig[run.status as keyof typeof statusConfig].label}
          </Badge>
          <DownloadPayrollButton run={run} />
        </div>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pay Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{run.payPeriod}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pay Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{new Date(run.payDate).toLocaleDateString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{run.employeeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Net Payable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-emerald-600">GHS {run.totalNetPay.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Breakdown of payroll amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Gross Pay</span>
              <span className="font-medium">GHS {run.totalGrossPay.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Total Deductions</span>
              <span className="font-medium text-red-600">- GHS {run.totalDeductions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-semibold">Net Pay</span>
              <span className="font-bold text-emerald-600 text-lg">GHS {run.totalNetPay.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Payments</CardTitle>
          <CardDescription>Individual employee payment details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">Employee</th>
                  <th className="p-3 text-right font-medium">Gross Pay</th>
                  <th className="p-3 text-right font-medium">Deductions</th>
                  <th className="p-3 text-right font-medium">Net Pay</th>
                </tr>
              </thead>
              <tbody>
                {run.employeePayments.map((payment: any) => (
                  <tr key={payment.employeeId._id} className="border-b">
                    <td className="p-3">{payment.employeeId.userId?.fullName || "N/A"}</td>
                    <td className="p-3 text-right">GHS {payment.grossPay.toLocaleString()}</td>
                    <td className="p-3 text-right text-red-600">GHS {payment.totalDeductions.toLocaleString()}</td>
                    <td className="p-3 text-right font-medium text-emerald-600">GHS {payment.netPay.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {run.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{run.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
