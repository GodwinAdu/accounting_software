import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getFixedAssets } from "@/lib/actions/fixed-asset.action";
import { AssetsList } from "./_components/assets-list";
import Heading from "@/components/commons/Header";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function AllAssetsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("assets_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("assets_create");

  const assetsResult = await getFixedAssets();
  const assets = assetsResult.success ? assetsResult.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Fixed Assets"
        description="Manage your fixed assets and depreciation"
      />
      <Separator />
      <AssetsList assets={assets} hasCreatePermission={hasCreatePermission} />
    </div>
  );
}
