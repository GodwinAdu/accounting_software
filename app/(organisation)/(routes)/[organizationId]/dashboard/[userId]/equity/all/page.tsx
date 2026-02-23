import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getEquityTransactions } from "@/lib/actions/equity-transaction.action";
import { EquityList } from "./_components/equity-list";
import Heading from "@/components/commons/Header";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function AllEquityPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("equity_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("equity_create");

  const transactionsResult = await getEquityTransactions();
  const transactions = transactionsResult.success ? transactionsResult.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Equity Transactions"
        description="Manage owner investments, drawings, and dividends"
      />
      <Separator />
      <EquityList transactions={transactions} hasCreatePermission={hasCreatePermission} />
    </div>
  );
}
