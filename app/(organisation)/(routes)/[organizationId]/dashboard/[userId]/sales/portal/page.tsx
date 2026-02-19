import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getPortalSettings } from "@/lib/actions/portal-settings.action";
import CustomerPortalView from "./_components/customer-portal-view";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function CustomerPortalPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("customerPortal_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getPortalSettings();
  const settings = result.success ? result.data : null;

  return (
    <div className="space-y-6">
      <Heading title="Customer Portal" description="Self-service portal for customers" />
      <Separator />
      <CustomerPortalView organizationId={organizationId} settings={settings} />
    </div>
  );
}
