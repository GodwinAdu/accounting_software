import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getLeaveRequests } from "@/lib/actions/leave-request.action";
import Link from "next/link";

export default async function LeavePage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const requestsResult = await getLeaveRequests();
  const requests = requestsResult.data || [];

  const formattedRequests = requests.map((req: any) => ({
    _id: req._id,
    id: req._id,
    employee: req.employeeId?.userId?.fullName || "N/A",
    employeeNumber: req.employeeId?.employeeNumber || "",
    leaveType: req.leaveType.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
    startDate: new Date(req.startDate).toLocaleDateString(),
    endDate: new Date(req.endDate).toLocaleDateString(),
    days: req.days,
    status: req.status,
    reason: req.reason || "",
  }));

  const pending = requests.filter((l: any) => l.status === "pending").length;
  const approved = requests.filter((l: any) => l.status === "approved").length;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Leave Management"
          description="Manage employee leave requests and balances"
        />
        {true && (
          <Link href={`/${organizationId}/dashboard/${userId}/payroll/leave/new`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              New Leave Request
            </Button>
          </Link>
        )}
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
            <p className="text-2xl font-bold">{requests.length}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-emerald-600">{approved}</p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={formattedRequests} />
    </div>
  );
}
