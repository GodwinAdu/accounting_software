import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getBills } from "@/lib/actions/bill.action";
import { BillsList } from "./_components/bills-list";
import Heading from "@/components/commons/Header";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function BillsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("bills_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("bills_create");

  const result = await getBills();
  const bills = result.success ? result.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Bills"
        description="Manage vendor bills and payables"
      />
      <Separator />
      <BillsList bills={bills} hasCreatePermission={hasCreatePermission} organizationId={organizationId} userId={userId} />
    </div>
  );
}
