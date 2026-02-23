import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getLoans } from "@/lib/actions/loan.action";
import { LoansList } from "./_components/loans-list";
import Heading from "@/components/commons/Header";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function AllLoansPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("loans_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("loans_create");

  const loansResult = await getLoans();
  const loans = loansResult.success ? loansResult.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Loans"
        description="Manage your business loans and financing"
      />
      <Separator />
      <LoansList loans={loans} hasCreatePermission={hasCreatePermission} />
    </div>
  );
}
