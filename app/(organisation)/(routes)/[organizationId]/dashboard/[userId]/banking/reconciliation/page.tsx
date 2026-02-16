import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import ReconciliationTool from "./_components/reconciliation-tool";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function ReconciliationPage({ params }: { params: Props }) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { organizationId, userId } = await params;

  return (
    <div className="space-y-6">
      <Heading
        title="Bank Reconciliation"
        description="Reconcile your bank statements with your records"
      />
      <Separator />
      <ReconciliationTool organizationId={organizationId} userId={userId} />
    </div>
  );
}
