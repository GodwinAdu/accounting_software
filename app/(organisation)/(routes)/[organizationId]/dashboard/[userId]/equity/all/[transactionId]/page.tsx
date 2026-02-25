import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getEquityTransactionById } from "@/lib/actions/equity-transaction.action";
import { EditEquityForm } from "./_components/edit-equity-form";

type Props = Promise<{ organizationId: string; userId: string; transactionId: string }>;

export default async function EditEquityPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId, transactionId } = await params;

  const hasEditPermission = await checkPermission("equity_edit");
  if (!hasEditPermission) {
    redirect(`/${organizationId}/dashboard/${userId}/equity/all`);
  }

  const result = await getEquityTransactionById(transactionId);
  if (!result.success || !result.data) {
    redirect(`/${organizationId}/dashboard/${userId}/equity/all`);
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <EditEquityForm transaction={result.data} />
    </div>
  );
}
