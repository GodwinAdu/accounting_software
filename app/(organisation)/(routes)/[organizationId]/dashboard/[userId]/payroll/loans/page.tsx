import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getEmployeeLoans } from "@/lib/actions/employee-loan.action";
import { LoansClient } from "./_components/loans-client";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function LoansPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("loans_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getEmployeeLoans();
  const loans = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <Heading title="Employee Loans" description="Manage employee loans and repayments" />
      <Separator />
      <LoansClient loans={loans} />
    </div>
  );
}
