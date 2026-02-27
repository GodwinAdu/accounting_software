"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AIButton } from "@/components/ai/ai-button";
import { AIInsightCard } from "@/components/ai/ai-insight-card";
import { suggestBudget } from "@/lib/actions/ai.action";
import { toast } from "sonner";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BudgetSuggestionProps {
  onApply?: (amount: number) => void;
}

export function BudgetSuggestion({ onApply }: BudgetSuggestionProps) {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);

  const handleSuggest = async () => {
    if (!category) {
      toast.error("Please enter category");
      return;
    }

    setLoading(true);
    try {
      const result = await suggestBudget(category);
      if (result.success) {
        setSuggestion(result.budget);
      } else {
        toast.error(result.error || "Failed to get budget suggestion");
      }
    } catch (error) {
      toast.error("Failed to get budget suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">AI Budget Suggestion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">Expense Category</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Office Supplies"
          />
        </div>

        <AIButton onClick={handleSuggest} loading={loading} className="w-full">
          Get Budget Suggestion
        </AIButton>

        {suggestion && (
          <AIInsightCard
            title="Monthly Budget Recommendation"
            content={
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <TrendingDown className="h-3 w-3" />
                      Minimum
                    </div>
                    <p className="font-semibold">GHS {suggestion.min?.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-xs text-muted-foreground mb-1">Suggested</p>
                    <p className="font-semibold text-emerald-600">
                      GHS {suggestion.suggested?.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <TrendingUp className="h-3 w-3" />
                      Maximum
                    </div>
                    <p className="font-semibold">GHS {suggestion.max?.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.reasoning}</p>
                {onApply && (
                  <AIButton
                    onClick={() => {
                      onApply(suggestion.suggested);
                      toast.success("Budget applied");
                    }}
                    variant="default"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Apply Suggested Budget
                  </AIButton>
                )}
              </div>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
