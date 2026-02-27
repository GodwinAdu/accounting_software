"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AIButton } from "@/components/ai/ai-button";
import { AIInsightCard } from "@/components/ai/ai-insight-card";
import { suggestJournalEntry } from "@/lib/actions/ai.action";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

interface JournalEntrySuggestionProps {
  onApply?: (debit: string, credit: string, amount: number) => void;
}

export function JournalEntrySuggestion({ onApply }: JournalEntrySuggestionProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);

  const handleSuggest = async () => {
    if (!description || !amount) {
      toast.error("Please enter description and amount");
      return;
    }

    setLoading(true);
    try {
      const result = await suggestJournalEntry(description, parseFloat(amount));
      if (result.success) {
        setSuggestion(result.suggestion);
      } else {
        toast.error(result.error || "Failed to get suggestion");
      }
    } catch (error) {
      toast.error("Failed to get suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">AI Journal Entry Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Transaction Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Purchased office equipment"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (GHS)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 5000"
          />
        </div>

        <AIButton onClick={handleSuggest} loading={loading} className="w-full">
          Suggest Journal Entry
        </AIButton>

        {suggestion && (
          <AIInsightCard
            title="Suggested Journal Entry"
            content={
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <p className="text-xs text-muted-foreground">Debit</p>
                    <p className="font-semibold">{suggestion.debit?.account}</p>
                    <p className="text-sm text-emerald-600">
                      GHS {suggestion.debit?.amount?.toLocaleString()}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Credit</p>
                    <p className="font-semibold">{suggestion.credit?.account}</p>
                    <p className="text-sm text-red-600">
                      GHS {suggestion.credit?.amount?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.reasoning}</p>
                {onApply && (
                  <AIButton
                    onClick={() => {
                      onApply(
                        suggestion.debit?.account,
                        suggestion.credit?.account,
                        suggestion.debit?.amount
                      );
                      toast.success("Journal entry applied");
                    }}
                    variant="default"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Apply Entry
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
