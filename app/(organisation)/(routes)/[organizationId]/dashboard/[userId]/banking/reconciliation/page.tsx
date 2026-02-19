import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getBankReconciliations } from "@/lib/actions/bank-reconciliation.action";
import { getBankAccounts } from "@/lib/actions/bank-account.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import ReconciliationTool from "./_components/reconciliation-tool";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function ReconciliationPage({ params }: { params: Props }) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("banking_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const reconciliationsResult = await getBankReconciliations();
  const reconciliations = reconciliationsResult.data || [];

  const accountsResult = await getBankAccounts();
  const accounts = accountsResult.data || [];

  return (
    <div className="space-y-6">
      <Heading
        title="Bank Reconciliation"
        description="Reconcile your bank statements with your records"
      />
      <Separator />
      <ReconciliationTool 
        organizationId={organizationId} 
        userId={userId}
        reconciliations={reconciliations}
        accounts={accounts}
      />
    </div>
  );
}
