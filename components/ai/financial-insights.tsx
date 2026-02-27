"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIButton } from "@/components/ai/ai-button";
import { getFinancialInsights } from "@/lib/actions/ai.action";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export function FinancialInsights() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState("");
  const [metrics, setMetrics] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await getFinancialInsights();
      if (result.success) {
        setInsights(result.insights);
        setMetrics(result.metrics);
      } else {
        toast.error(result.error || "Failed to get insights");
      }
    } catch (error) {
      toast.error("Failed to get insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">AI Financial Insights</CardTitle>
          <AIButton onClick={handleAnalyze} loading={loading}>
            Analyze
          </AIButton>
        </div>
      </CardHeader>
      <CardContent>
        {metrics && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
              <p className="text-lg font-semibold">GHS {metrics.totalRevenue?.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <p className="text-xs text-muted-foreground">Expenses</p>
              </div>
              <p className="text-lg font-semibold">GHS {metrics.totalExpenses?.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <p className="text-xs text-muted-foreground">Net Income</p>
              </div>
              <p className="text-lg font-semibold">GHS {metrics.netIncome?.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-muted-foreground mb-1">Profit Margin</p>
              <p className="text-lg font-semibold">{metrics.profitMargin}%</p>
            </div>
          </div>
        )}
        {insights ? (
          <div className="text-sm whitespace-pre-wrap">{insights}</div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click "Analyze" to get AI-powered financial insights
          </p>
        )}
      </CardContent>
    </Card>
  );
}
