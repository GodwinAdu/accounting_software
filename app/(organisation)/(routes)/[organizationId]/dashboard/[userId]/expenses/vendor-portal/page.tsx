import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import VendorPortalView from "./_components/vendor-portal-view";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function VendorPortalPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("vendorPortal_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  return (
    <div className="space-y-6">
      <Heading title="Vendor Portal" description="Self-service portal for vendors" />
      <Separator />
      <VendorPortalView organizationId={organizationId} />
    </div>
  );
}
