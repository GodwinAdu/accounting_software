"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AIButton } from "@/components/ai/ai-button";
import { AIInsightCard } from "@/components/ai/ai-insight-card";
import { suggestSalary } from "@/lib/actions/ai.action";
import { toast } from "sonner";

interface SalarySuggestionModalProps {
  open: boolean;
  onClose: () => void;
  onApply?: (salary: number) => void;
}

export function SalarySuggestionModal({ open, onClose, onApply }: SalarySuggestionModalProps) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);

  const handleSuggest = async () => {
    if (!role || !experience) {
      toast.error("Please enter role and experience");
      return;
    }

    setLoading(true);
    try {
      const result = await suggestSalary(role, parseInt(experience), industry || undefined);
      if (result.success) {
        setSuggestion(result.suggestion);
      } else {
        toast.error(result.error || "Failed to get salary suggestion");
      }
    } catch (error) {
      toast.error("Failed to get salary suggestion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>AI Salary Suggestion</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Job Role</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g., 5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry (Optional)</Label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., Technology"
            />
          </div>

          <AIButton onClick={handleSuggest} loading={loading} className="w-full">
            Get AI Suggestion
          </AIButton>

          {suggestion && (
            <AIInsightCard
              title="Salary Recommendation"
              content={
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Minimum</p>
                      <p className="font-semibold">GHS {suggestion.min?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Average</p>
                      <p className="font-semibold text-emerald-600">
                        GHS {suggestion.average?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Maximum</p>
                      <p className="font-semibold">GHS {suggestion.max?.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{suggestion.reasoning}</p>
                  {onApply && (
                    <AIButton
                      onClick={() => {
                        onApply(suggestion.average);
                        onClose();
                      }}
                      variant="default"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      Apply Average Salary
                    </AIButton>
                  )}
                </div>
              }
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
