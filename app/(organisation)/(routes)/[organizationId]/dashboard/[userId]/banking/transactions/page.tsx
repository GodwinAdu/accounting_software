import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import TransactionsList from "./_components/transactions-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function TransactionsPage({ params }: { params: Props }) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { organizationId, userId } = await params;

  return (
    <div className="space-y-6">
      <Heading
        title="Transactions"
        description="View and manage all your bank transactions"
      />
      <Separator />
      <TransactionsList organizationId={organizationId} userId={userId} />
    </div>
  );
}
