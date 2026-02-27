"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIButton } from "@/components/ai/ai-button";
import { suggestTaxDeductions } from "@/lib/actions/ai.action";
import { toast } from "sonner";

export function TaxDeductions() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await suggestTaxDeductions();
      if (result.success) {
        setSuggestions(result.suggestions);
      } else {
        toast.error(result.error || "Failed to analyze tax deductions");
      }
    } catch (error) {
      toast.error("Failed to analyze tax deductions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">AI Tax Deduction Suggestions</CardTitle>
          <AIButton onClick={handleAnalyze} loading={loading}>
            Analyze
          </AIButton>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions ? (
          <div className="text-sm whitespace-pre-wrap bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            {suggestions}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click "Analyze" to get AI suggestions for tax-deductible expenses
          </p>
        )}
      </CardContent>
    </Card>
  );
}
