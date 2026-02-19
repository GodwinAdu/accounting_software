import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getStockAdjustments } from "@/lib/actions/stock-adjustment.action";
import { currentUser } from "@/lib/helpers/session";
import { checkPermission } from "@/lib/helpers/check-permission";
import { AddAdjustmentDialog } from "./_components/add-adjustment-dialog";

export default async function AdjustmentsPage({
  params,
}: {
  params: { organizationId: string; userId: string };
}) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const hasViewPermission = await checkPermission("stockAdjustments_view");
  if (!hasViewPermission) {
    redirect(`/${params.organizationId}/dashboard/${params.userId}`);
  }

  const hasCreatePermission = await checkPermission("stockAdjustments_create");

  const result = await getStockAdjustments(params.organizationId);
  const adjustments = result.success ? result.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Stock Adjustments"
          description="Record inventory adjustments and corrections"
        />
        {hasCreatePermission && (
          <AddAdjustmentDialog organizationId={params.organizationId} />
        )}
      </div>
      <Separator />

      <DataTable columns={columns} data={adjustments} />
    </div>
  );
}
