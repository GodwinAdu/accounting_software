import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getFixedAssetById } from "@/lib/actions/fixed-asset.action";
import { EditAssetForm } from "./_components/edit-asset-form";

type Props = Promise<{ organizationId: string; userId: string; assetId: string }>;

export default async function EditAssetPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId, assetId } = await params;

  const hasEditPermission = await checkPermission("assets_edit");
  if (!hasEditPermission) {
    redirect(`/${organizationId}/dashboard/${userId}/assets/all`);
  }

  const result = await getFixedAssetById(assetId);
  if (!result.success || !result.data) {
    redirect(`/${organizationId}/dashboard/${userId}/assets/all`);
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <EditAssetForm asset={result.data} />
    </div>
  );
}
