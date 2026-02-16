import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import BankFeedsList from "./_components/bank-feeds-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function BankFeedsPage({ params }: { params: Props }) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { organizationId, userId } = await params;

  return (
    <div className="space-y-6">
      <Heading
        title="Bank Feeds"
        description="Connect your bank accounts for automatic transaction imports"
      />
      <Separator />
      <BankFeedsList organizationId={organizationId} userId={userId} />
    </div>
  );
}
