"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";

interface AssetsListProps {
  assets: any[];
  hasCreatePermission: boolean;
}

export function AssetsList({ assets, hasCreatePermission }: AssetsListProps) {
  const router = useRouter();

  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalDepreciation = assets.reduce((sum, asset) => sum + asset.accumulatedDepreciation, 0);
  const activeAssets = assets.filter(a => a.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.length}
            </div>
            <p className="text-xs text-muted-foreground">{activeAssets} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              GHS {totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Net book value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Depreciation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              GHS {totalDepreciation.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Accumulated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchase Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              GHS {(totalValue + totalDepreciation).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Original cost</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fixed Assets Register</CardTitle>
          </div>
          {hasCreatePermission && (
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => router.push("./all/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Asset
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={assets}
            searchKey="assetName"
          />
        </CardContent>
      </Card>
    </div>
  );
}
