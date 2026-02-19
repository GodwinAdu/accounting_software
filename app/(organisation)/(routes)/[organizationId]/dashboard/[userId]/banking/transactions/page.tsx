import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getBankTransactions } from "@/lib/actions/bank-transaction.action";
import { getBankAccounts } from "@/lib/actions/bank-account.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import TransactionsList from "./_components/transactions-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function TransactionsPage({ params }: { params: Props }) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("banking_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const transactionsResult = await getBankTransactions();
  const transactions = transactionsResult.data || [];

  const accountsResult = await getBankAccounts();
  const accounts = accountsResult.data || [];

  return (
    <div className="space-y-6">
      <Heading
        title="Transactions"
        description="View and manage all your bank transactions"
      />
      <Separator />
      <TransactionsList 
        organizationId={organizationId} 
        userId={userId}
        transactions={transactions}
        accounts={accounts}
      />
    </div>
  );
}
