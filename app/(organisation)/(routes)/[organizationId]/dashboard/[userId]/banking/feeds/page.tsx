import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getBankAccounts } from "@/lib/actions/bank-account.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import BankFeedsList from "./_components/bank-feeds-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function BankFeedsPage({ params }: { params: Props }) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("banking_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const accountsResult = await getBankAccounts();
  const accounts = accountsResult.data || [];

  return (
    <div className="space-y-6">
      <Heading
        title="Bank Feeds"
        description="Connect your bank accounts for automatic transaction imports"
      />
      <Separator />
      <BankFeedsList organizationId={organizationId} userId={userId} accounts={accounts} />
    </div>
  );
}
