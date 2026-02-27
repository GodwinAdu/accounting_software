"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIButton } from "@/components/ai/ai-button";
import { analyzePayroll } from "@/lib/actions/ai.action";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export function PayrollAnalysis() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState("");
  const [anomalies, setAnomalies] = useState(0);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzePayroll();
      if (result.success) {
        setInsights(result.insights);
        setAnomalies(result.anomalies);
      } else {
        toast.error(result.error || "Failed to analyze payroll");
      }
    } catch (error) {
      toast.error("Failed to analyze payroll");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">AI Payroll Analysis</CardTitle>
          <AIButton onClick={handleAnalyze} loading={loading}>
            Analyze
          </AIButton>
        </div>
      </CardHeader>
      <CardContent>
        {insights ? (
          <div className="space-y-3">
            {anomalies > 0 && (
              <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <p className="text-sm text-orange-800">{anomalies} anomalies detected</p>
              </div>
            )}
            <div className="text-sm whitespace-pre-wrap">{insights}</div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click "Analyze" to get AI insights on payroll costs and trends
          </p>
        )}
      </CardContent>
    </Card>
  );
}
