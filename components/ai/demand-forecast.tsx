"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp } from "lucide-react";
import { forecastDemand } from "@/lib/actions/ai.action";
import { toast } from "sonner";

interface DemandForecastProps {
  productId: string;
  productName: string;
}

export function DemandForecast({ productId, productName }: DemandForecastProps) {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any>(null);

  const handleForecast = async () => {
    setLoading(true);
    const result = await forecastDemand(productId);
    setLoading(false);

    if (result.success) {
      setForecast(result.forecast);
      toast.success("Demand forecast generated");
    } else {
      toast.error(result.error || "Failed to generate forecast");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          AI Demand Forecast
        </CardTitle>
        <CardDescription>Predict future demand for {productName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!forecast ? (
          <Button onClick={handleForecast} disabled={loading} className="w-full">
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? "Analyzing..." : "Generate Forecast"}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              {forecast.forecast?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between p-2 bg-muted rounded">
                  <span className="font-medium">{item.month}</span>
                  <span className="text-purple-600">{item.quantity} units</span>
                </div>
              ))}
            </div>
            {forecast.reorderPoint && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                <p className="text-sm font-medium text-amber-900">
                  Reorder Point: {forecast.reorderPoint} units
                </p>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={`px-2 py-1 rounded ${
                forecast.confidence === "high" ? "bg-green-100 text-green-700" :
                forecast.confidence === "medium" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
                {forecast.confidence} confidence
              </span>
            </div>
            <Button onClick={handleForecast} variant="outline" size="sm" className="w-full">
              Regenerate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
