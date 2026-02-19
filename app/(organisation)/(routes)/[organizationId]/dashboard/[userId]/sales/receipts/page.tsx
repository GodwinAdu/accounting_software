import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getReceipts } from "@/lib/actions/receipt.action";
import { ReceiptsList } from "./_components/receipts-list";
import Heading from "@/components/commons/Header";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function ReceiptsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("receipts_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("receipts_create");

  const result = await getReceipts();
  const receipts = result.success ? result.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Sales Receipts"
        description="Manage sales receipts and cash sales"
      />
      <Separator />
      <ReceiptsList receipts={receipts} hasCreatePermission={hasCreatePermission} organizationId={organizationId} userId={userId} />
    </div>
  );
}
