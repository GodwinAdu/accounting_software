import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getBankReconciliations } from "@/lib/actions/bank-reconciliation.action";
import { getBankAccounts } from "@/lib/actions/bank-account.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import ReconciliationTool from "./_components/reconciliation-tool";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

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
      
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900 font-semibold">Reconciliation Best Practices</AlertTitle>
        <AlertDescription className="text-green-800 mt-2">
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Step 1:</span> Enter your bank statement ending balance and date</p>
            <p><span className="font-semibold">Step 2:</span> Match transactions - check off items that appear on both your records and bank statement</p>
            <p><span className="font-semibold">Step 3:</span> Investigate differences - unmatched items may be timing differences or errors</p>
            <p><span className="font-semibold">Step 4:</span> Reconcile when difference is zero - this confirms your records match the bank</p>
            <p className="text-amber-700 font-semibold mt-2">⚠️ Reconcile monthly to catch errors early and maintain accurate records</p>
          </div>
        </AlertDescription>
      </Alert>

      <ReconciliationTool 
        organizationId={organizationId} 
        userId={userId}
        reconciliations={reconciliations}
        accounts={accounts}
      />
    </div>
  );
}
