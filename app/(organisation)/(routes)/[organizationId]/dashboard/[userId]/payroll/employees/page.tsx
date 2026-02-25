import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getEmployees, getEmployeeSummary } from "@/lib/actions/employee.action";
import Link from "next/link";

export default async function EmployeesPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const [employeesResult, summaryResult] = await Promise.all([
    getEmployees(),
    getEmployeeSummary(),
  ]);

  const employees = employeesResult.data || [];
  const summary = summaryResult.data || { totalEmployees: 0, activeEmployees: 0, totalPayroll: 0 };

  const formattedEmployees = employees.map((emp: any) => ({
    _id: emp._id,
    id: emp._id,
    employeeId: emp.employeeNumber,
    name: emp.userId ? `${emp.userId.fullName}` : "N/A",
    email: emp.userId?.email || "N/A",
    phone: emp.userId?.phone || "N/A",
    department: emp.department,
    position: emp.position,
    salary: emp.salary,
    status: emp.status,
    hireDate: new Date(emp.hireDate).toLocaleDateString(),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`Employees (${summary.totalEmployees})`}
          description="Manage your workforce and employee information"
        />
        {employeesResult.success && (
          <Link href={`/${organizationId}/dashboard/${userId}/payroll/employees/new`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </Link>
        )}
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
            <p className="text-2xl font-bold">{summary.totalEmployees}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
            <p className="text-2xl font-bold text-emerald-600">{summary.activeEmployees}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Monthly Payroll</p>
            <p className="text-2xl font-bold">GHS {summary.totalPayroll.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={formattedEmployees} />
    </div>
  );
}
