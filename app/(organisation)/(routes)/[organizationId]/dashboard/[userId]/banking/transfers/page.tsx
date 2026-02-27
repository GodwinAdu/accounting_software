import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getBankAccounts } from "@/lib/actions/bank-account.action";
import { getBankTransfers } from "@/lib/actions/bank-transfer.action";
import TransfersList from "./_components/transfers-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function TransfersPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("bankTransfers_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const hasCreatePermission = await checkPermission("bankTransfers_create");

  const accountsResult = await getBankAccounts();
  const accounts = accountsResult.data || [];

  const transfersResult = await getBankTransfers();
  const transfers = transfersResult.data || [];

  return (
    <div className="space-y-6">
      <Heading title="Bank Transfers" description="Transfer funds between your bank accounts" />
      <Separator />
      <TransfersList accounts={accounts} transfers={transfers} hasCreatePermission={hasCreatePermission} />
    </div>
  );
}
