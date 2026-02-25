"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Play, Info } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DepreciationClientProps {
  assets: any[];
}

export default function DepreciationClient({ assets }: DepreciationClientProps) {
  const router = useRouter();
  const [running, setRunning] = useState(false);

  const handleRunDepreciation = async () => {
    setRunning(true);
    try {
      const response = await fetch("/api/depreciation/run", {
        method: "POST",
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success(`Depreciation posted for ${result.results.length} assets`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to run depreciation");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to run depreciation");
    }
    setRunning(false);
  };

  return (
    <>
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900">
          <p className="font-medium mb-1">How depreciation works</p>
          <p className="text-blue-700">Depreciation spreads the cost of assets over their useful life. Click "Run Depreciation" to post this month's depreciation to the General Ledger. This creates journal entries that reduce asset values and record depreciation expense.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Depreciation Schedule</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Monthly depreciation for all active assets</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-emerald-600 to-teal-600"
            onClick={handleRunDepreciation}
            disabled={running || assets.length === 0}
          >
            <Play className="h-4 w-4 mr-2" />
            {running ? "Running..." : "Run Depreciation"}
          </Button>
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
                const depPercent = asset.purchasePrice > 0 
                  ? ((asset.depreciation.totalDepreciation / asset.purchasePrice) * 100).toFixed(1) 
                  : "0.0";
                
                return (
                  <div key={asset._id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{asset.assetName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {asset.assetNumber} • {asset.category}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {asset.depreciationMethod.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Purchase Price</p>
                        <p className="font-medium">GHS {asset.purchasePrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Accumulated</p>
                        <p className="font-medium text-orange-600">
                          GHS {asset.depreciation.totalDepreciation.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{depPercent}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Value</p>
                        <p className="font-medium">
                          GHS {asset.depreciation.currentValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Monthly</p>
                        <p className="font-medium text-emerald-600">
                          GHS {asset.depreciation.monthlyDepreciation.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Remaining Life</p>
                        <p className="font-medium">
                          {asset.depreciation.remainingLife.toFixed(1)} years
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
