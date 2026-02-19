import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getPurchaseOrders } from "@/lib/actions/purchase-order.action";
import { PurchaseOrdersList } from "./_components/purchase-orders-list";
import Heading from "@/components/commons/Header";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function PurchaseOrdersPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("purchaseOrders_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("purchaseOrders_create");

  const result = await getPurchaseOrders();
  const purchaseOrders = result.success ? result.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Purchase Orders"
        description="Manage purchase orders and procurement"
      />
      <Separator />
      <PurchaseOrdersList purchaseOrders={purchaseOrders} hasCreatePermission={hasCreatePermission} organizationId={organizationId} userId={userId} />
    </div>
  );
}
