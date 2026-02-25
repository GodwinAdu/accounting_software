import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getOpportunities } from "@/lib/actions/opportunity.action";
import PipelineBoard from "../_components/pipeline-board";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function PipelinePage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("opportunities_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const result = await getOpportunities();
  const opportunities = result.success ? (result.opportunities || []) : [];

  return (
    <div className="space-y-6">
      <Heading title="Sales Pipeline" description="Visual pipeline of your opportunities" />
      <Separator />
      <PipelineBoard opportunities={opportunities} />
    </div>
  );
}
