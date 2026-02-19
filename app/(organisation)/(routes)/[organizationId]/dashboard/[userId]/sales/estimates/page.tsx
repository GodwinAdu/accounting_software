import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getEstimates } from "@/lib/actions/estimate.action";
import EstimatesList from "./_components/estimates-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function EstimatesPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("estimates_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("estimates_create");

  const result = await getEstimates();
  const estimates = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <Heading
        title="Estimates"
        description="Create and manage customer estimates"
      />
      <Separator />
      <EstimatesList estimates={estimates} hasCreatePermission={hasCreatePermission} organizationId={organizationId} userId={userId} />
    </div>
  );
}
