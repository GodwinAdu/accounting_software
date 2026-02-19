import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getVendors } from "@/lib/actions/vendor.action";
import { VendorsList } from "./_components/vendors-list";
import Heading from "@/components/commons/Header";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function VendorsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("vendors_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("vendors_create");

  const result = await getVendors();
  const vendors = result.success ? result.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Vendors"
        description="Manage your vendors and suppliers"
      />
      <Separator />
      <VendorsList vendors={vendors} hasCreatePermission={hasCreatePermission} />
    </div>
  );
}
