import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Boxes, DollarSign, TrendingDown, CheckCircle } from "lucide-react";
import { getAssetRegister } from "@/lib/actions/asset.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function AssetRegisterPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("assetRegister_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const { assets, summary } = await getAssetRegister();
  const { totalAssets, totalValue, totalDepreciation, netValue, activeAssets } = summary;

  return (
    <div className="space-y-6">
      <Heading title="Asset Register" description="Maintain a complete register of fixed assets" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-muted-foreground mt-1">{activeAssets} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Purchase price</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depreciation</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">GHS {totalDepreciation.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Accumulated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Value</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {netValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Current value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Fixed Assets</CardTitle>
          <Button size="sm">Add Asset</Button>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <div className="text-center py-12">
              <Boxes className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No assets registered</p>
              <p className="text-sm text-muted-foreground mt-2">Start tracking your fixed assets</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assets.map((asset: any) => (
                <div key={asset._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Boxes className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {asset.categoryId?.name} • {asset.assetNumber} • {asset.location || "No location"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">GHS {asset.currentValue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        Depreciation: GHS {asset.accumulatedDepreciation.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={asset.status === "active" ? "default" : "outline"}>
                      {asset.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
