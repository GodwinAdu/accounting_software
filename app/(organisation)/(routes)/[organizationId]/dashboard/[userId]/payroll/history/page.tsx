import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getPayrollRuns } from "@/lib/actions/payroll-run.action";

export default async function PayrollHistoryPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const runsResult = await getPayrollRuns();
  const runs = runsResult.data || [];

  const formattedRuns = runs.map((run: any) => ({
    _id: run._id,
    id: run._id,
    runNumber: run.runNumber,
    payPeriod: run.payPeriod,
    payDate: new Date(run.payDate).toLocaleDateString(),
    employees: run.employeeCount,
    grossPay: run.totalGrossPay,
    deductions: run.totalDeductions,
    netPay: run.totalNetPay,
    status: run.status,
  }));

  const totalPaid = runs.reduce((sum: number, r: any) => sum + r.totalNetPay, 0);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Payroll History"
          description="View past payroll runs and records"
        />
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Payroll Runs</p>
            <p className="text-2xl font-bold">{runs.length}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Paid (All Time)</p>
            <p className="text-2xl font-bold text-emerald-600">GHS {totalPaid.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={formattedRuns} />
    </div>
  );
}
