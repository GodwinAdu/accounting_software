import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, Calendar, DollarSign, BarChart3 } from "lucide-react";
import { getAllFixedAssets } from "@/lib/actions/fixed-asset.action";
import { calculateDepreciation } from "@/lib/helpers/depreciation";
import DepreciationClient from "./_components/depreciation-client";

type Props = Promise<{ organizationId: string; userId: string }>;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DepreciationPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("depreciation_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getAllFixedAssets();
  const allAssets = result.success ? (result.assets || []) : [];
  const activeAssets = allAssets.filter(a => a.status === "active");

  const assetsWithDepreciation = await Promise.all(
    activeAssets.map(async (asset) => {
      const depData = await calculateDepreciation(asset);
      return { ...asset, depreciation: depData };
    })
  );

  const monthlyDepreciation = assetsWithDepreciation.reduce((sum, a) => sum + a.depreciation.monthlyDepreciation, 0);
  const yearlyDepreciation = assetsWithDepreciation.reduce((sum, a) => sum + a.depreciation.annualDepreciation, 0);
  const totalAccumulated = allAssets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0);

  return (
    <div className="space-y-6">
      <Heading title="Depreciation" description="Track and calculate asset depreciation automatically" />
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
            <div className="text-2xl font-bold">{activeAssets.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Depreciating</p>
          </CardContent>
        </Card>
      </div>

      <DepreciationClient assets={assetsWithDepreciation} />
    </div>
  );
}
