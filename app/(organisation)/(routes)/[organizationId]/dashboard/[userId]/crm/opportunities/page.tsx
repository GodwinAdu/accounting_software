import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getOpportunities } from "@/lib/actions/opportunity.action";
import OpportunitiesList from "../_components/opportunities-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function OpportunitiesPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("opportunities_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("opportunities_create");

  const result = await getOpportunities();
  const opportunities = result.success ? (result.opportunities || []) : [];

  return (
    <div className="space-y-6">
      <Heading title="Opportunities" description="Track your sales opportunities" />
      <Separator />
      <OpportunitiesList opportunities={opportunities} hasCreatePermission={hasCreatePermission} organizationId={organizationId} userId={userId} />
    </div>
  );
}
