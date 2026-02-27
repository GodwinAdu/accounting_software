"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, DollarSign } from "lucide-react";
import { optimizePrice } from "@/lib/actions/ai.action";
import { toast } from "sonner";

interface PriceOptimizationProps {
  productId: string;
  productName: string;
  currentPrice: number;
  onApply?: (price: number) => void;
}

export function PriceOptimization({ productId, productName, currentPrice, onApply }: PriceOptimizationProps) {
  const [loading, setLoading] = useState(false);
  const [optimization, setOptimization] = useState<any>(null);

  const handleOptimize = async () => {
    setLoading(true);
    const result = await optimizePrice(productId, currentPrice);
    setLoading(false);

    if (result.success) {
      setOptimization(result.optimization);
      toast.success("Price optimization complete");
    } else {
      toast.error(result.error || "Failed to optimize price");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-600" />
          AI Price Optimization
        </CardTitle>
        <CardDescription>Optimize pricing for {productName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!optimization ? (
          <Button onClick={handleOptimize} disabled={loading} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Analyzing..." : "Optimize Price"}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted rounded">
                <p className="text-xs text-muted-foreground">Current Price</p>
                <p className="text-lg font-bold">GHS {currentPrice.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                <p className="text-xs text-emerald-700">Suggested Price</p>
                <p className="text-lg font-bold text-emerald-600">
                  GHS {optimization.suggestedPrice?.toLocaleString()}
                </p>
              </div>
            </div>
            {optimization.expectedRevenue && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-medium text-blue-900">
                  Expected Revenue: GHS {optimization.expectedRevenue.toLocaleString()}
                </p>
              </div>
            )}
            {optimization.reasoning && (
              <p className="text-sm text-muted-foreground">{optimization.reasoning}</p>
            )}
            <div className="flex gap-2">
              {onApply && (
                <Button onClick={() => onApply(optimization.suggestedPrice)} className="flex-1">
                  Apply Price
                </Button>
              )}
              <Button onClick={handleOptimize} variant="outline" size="sm" className="flex-1">
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
