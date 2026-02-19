import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { getDepreciationData } from "@/lib/actions/asset.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function DepreciationPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("depreciation_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const { assets, summary } = await getDepreciationData();
  const { monthlyDepreciation, yearlyDepreciation, totalAccumulated, assetsCount } = summary;

  return (
    <div className="space-y-6">
      <Heading title="Depreciation" description="Calculate and track asset depreciation" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Depreciation</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {monthlyDepreciation.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yearly Depreciation</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">GHS {yearlyDepreciation.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Annual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accumulated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalAccumulated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Depreciating</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Depreciation Schedule</CardTitle>
          <Button size="sm">Run Depreciation</Button>
        </CardHeader>
        <CardContent>
          {assets.length === 0 ? (
            <div className="text-center py-12">
              <TrendingDown className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No active assets</p>
              <p className="text-sm text-muted-foreground mt-2">Add assets to track depreciation</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assets.map((asset: any) => {
                const annualDep = (asset.purchasePrice - asset.salvageValue) / asset.usefulLife;
                const monthlyDep = annualDep / 12;
                const remainingValue = asset.currentValue - asset.accumulatedDepreciation;
                return (
                  <div key={asset._id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{asset.name}</h3>
                        <p className="text-sm text-muted-foreground">{asset.categoryId?.name}</p>
                      </div>
                      <Badge>{asset.depreciationMethod.replace("_", " ")}</Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Purchase Price</p>
                        <p className="font-medium">GHS {asset.purchasePrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Accumulated</p>
                        <p className="font-medium">GHS {asset.accumulatedDepreciation.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Remaining Value</p>
                        <p className="font-medium">GHS {remainingValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly</p>
                        <p className="font-medium text-orange-600">GHS {monthlyDep.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Annual</p>
                        <p className="font-medium text-orange-600">GHS {annualDep.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
