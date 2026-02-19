import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getBankAccounts, getBankAccountsSummary } from "@/lib/actions/bank-account.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import BankAccountsList from "./_components/bank-accounts-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function BankAccountsPage({ params }: { params: Props }) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("banking_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const accountsResult = await getBankAccounts();
  const accounts = accountsResult.data || [];

  const summaryResult = await getBankAccountsSummary();
  const summary = summaryResult.data || { totalBalance: 0, totalAccounts: 0, activeAccounts: 0 };

  return (
    <div className="space-y-6">
      <Heading
        title="Bank Accounts"
        description="Manage your business bank accounts and connections"
      />
      <Separator />
      <BankAccountsList 
        organizationId={organizationId} 
        userId={userId}
        accounts={accounts}
        summary={summary}
      />
    </div>
  );
}
