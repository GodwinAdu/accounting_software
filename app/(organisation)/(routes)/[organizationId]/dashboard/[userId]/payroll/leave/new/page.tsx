import { redirect } from "next/navigation";
import { getEmployees } from "@/lib/actions/employee.action";
import LeaveRequestForm from "./_components/leave-request-form";

export default async function NewLeaveRequestPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const employeesResult = await getEmployees();
  const employees = (employeesResult.data || []).filter((e: any) => e.status === "active");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <LeaveRequestForm employees={employees} organizationId={organizationId} userId={userId} />
    </div>
  );
}
