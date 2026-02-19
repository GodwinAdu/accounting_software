import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getLeads } from "@/lib/actions/lead.action";
import LeadsList from "../_components/leads-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function LeadsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("leads_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("leads_create");

  const result = await getLeads();
  const leads = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <Heading title="Leads" description="Manage your sales leads" />
      <Separator />
      <LeadsList leads={leads} hasCreatePermission={hasCreatePermission} organizationId={organizationId} userId={userId} />
    </div>
  );
}
