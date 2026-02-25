import { Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getEmployees } from "@/lib/actions/employee.action";
import { getDeductions } from "@/lib/actions/deduction.action";
import { fetchOrganizationUserById } from "@/lib/actions/organization.action";
import { PayrollRunClient } from "./_components/payroll-run-client";
import Link from "next/link";

export default async function PayrollRunPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const [employeesResult, deductionsResult, org] = await Promise.all([
    getEmployees(),
    getDeductions(),
    fetchOrganizationUserById(),
  ]);

  const employees = (employeesResult.data || []).filter((e: any) => e.status === "active");
  const deductions = (deductionsResult.data || []).filter((d: any) => d.status === "active");
  
  const hasPayrollAccounts = org.payrollSettings?.salaryExpenseAccountId && 
                             org.payrollSettings?.salaryPayableAccountId && 
                             org.payrollSettings?.taxPayableAccountId;

  const payrollData = employees.map((emp: any) => {
    let totalDeductions = 0;
    deductions.forEach((ded: any) => {
      if (ded.calculationType === "percentage") {
        totalDeductions += (emp.salary * ded.rate) / 100;
      } else {
        totalDeductions += ded.rate;
      }
    });
    return {
      id: emp._id,
      name: emp.userId?.fullName || "N/A",
      salary: emp.salary,
      deductions: totalDeductions,
      netPay: emp.salary - totalDeductions,
    };
  });

  const totalGross = payrollData.reduce((sum, emp) => sum + emp.salary, 0);
  const totalDeductions = payrollData.reduce((sum, emp) => sum + emp.deductions, 0);
  const totalNet = payrollData.reduce((sum, emp) => sum + emp.netPay, 0);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Run Payroll"
          description="Process employee salaries and generate payslips"
        />
        <PayrollRunClient payrollData={payrollData} totalGross={totalGross} totalDeductions={totalDeductions} totalNet={totalNet} />
      </div>
      <Separator />

      {!hasPayrollAccounts && (
        <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950">
          <Settings className="h-4 w-4 text-amber-600" />
          <AlertDescription className="ml-2">
            <span className="font-medium text-amber-900 dark:text-amber-100">Payroll accounts not configured.</span>
            <span className="text-amber-700 dark:text-amber-200"> Please set up your payroll account mapping in </span>
            <Link href={`/${organizationId}/dashboard/${userId}/settings/company?tab=payroll`} className="font-medium underline text-amber-900 dark:text-amber-100 hover:text-amber-700">
              Company Settings → Payroll
            </Link>
            <span className="text-amber-700 dark:text-amber-200"> to ensure payroll transactions are recorded correctly. Default accounts will be created if not configured.</span>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Gross Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalGross.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">GHS {totalDeductions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Net Payable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {totalNet.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Summary</CardTitle>
          <CardDescription>Review employee payments before processing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">Employee</th>
                    <th className="p-3 text-right font-medium">Gross Salary</th>
                    <th className="p-3 text-right font-medium">Deductions</th>
                    <th className="p-3 text-right font-medium">Net Pay</th>
                    <th className="p-3 text-center font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map((emp) => (
                    <tr key={emp.id} className="border-b">
                      <td className="p-3">{emp.name}</td>
                      <td className="p-3 text-right">GHS {emp.salary.toLocaleString()}</td>
                      <td className="p-3 text-right text-red-600">GHS {emp.deductions.toLocaleString()}</td>
                      <td className="p-3 text-right font-medium text-emerald-600">GHS {emp.netPay.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50 font-bold">
                    <td className="p-3">Total</td>
                    <td className="p-3 text-right">GHS {totalGross.toLocaleString()}</td>
                    <td className="p-3 text-right text-red-600">GHS {totalDeductions.toLocaleString()}</td>
                    <td className="p-3 text-right text-emerald-600">GHS {totalNet.toLocaleString()}</td>
                    <td className="p-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
