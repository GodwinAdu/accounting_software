"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Briefcase, AlertTriangle } from "lucide-react";
import { forecastProjectBudget } from "@/lib/actions/ai.action";
import { toast } from "sonner";

interface ProjectBudgetForecastProps {
  projectName?: string;
  onApply?: (budget: number) => void;
}

export function ProjectBudgetForecast({ projectName, onApply }: ProjectBudgetForecastProps) {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<any>(null);
  const [formData, setFormData] = useState({
    projectName: projectName || "",
    estimatedHours: "",
    resources: "",
  });

  const handleForecast = async () => {
    if (!formData.projectName || !formData.estimatedHours || !formData.resources) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    const result = await forecastProjectBudget(
      formData.projectName,
      parseInt(formData.estimatedHours),
      parseInt(formData.resources)
    );
    setLoading(false);

    if (result.success) {
      setForecast(result.forecast);
      toast.success("Budget forecast generated");
    } else {
      toast.error(result.error || "Failed to generate forecast");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          AI Budget Forecast
        </CardTitle>
        <CardDescription>Estimate project costs and timeline</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!forecast ? (
          <>
            <div className="space-y-3">
              <div>
                <Label>Project Name</Label>
                <Input
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label>Estimated Hours</Label>
                <Input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  placeholder="e.g., 160"
                />
              </div>
              <div>
                <Label>Number of Resources</Label>
                <Input
                  type="number"
                  value={formData.resources}
                  onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                  placeholder="e.g., 3"
                />
              </div>
            </div>
            <Button onClick={handleForecast} disabled={loading} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Analyzing..." : "Generate Forecast"}
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-xs text-blue-700">Estimated Cost</p>
                <p className="text-lg font-bold text-blue-600">
                  GHS {forecast.estimatedCost?.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                <p className="text-xs text-amber-700">Contingency</p>
                <p className="text-lg font-bold text-amber-600">
                  GHS {forecast.contingency?.toLocaleString()}
                </p>
              </div>
            </div>
            {forecast.timeline && (
              <div className="p-3 bg-muted rounded">
                <p className="text-sm font-medium">Timeline: {forecast.timeline}</p>
              </div>
            )}
            {forecast.risks && forecast.risks.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded space-y-1">
                <div className="flex items-center gap-2 text-red-900 font-medium text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Potential Risks
                </div>
                <ul className="list-disc list-inside text-xs text-red-800 space-y-1">
                  {forecast.risks.map((risk: string, i: number) => (
                    <li key={i}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-2">
              {onApply && (
                <Button onClick={() => onApply(forecast.estimatedCost)} className="flex-1">
                  Apply Budget
                </Button>
              )}
              <Button onClick={handleForecast} variant="outline" size="sm" className="flex-1">
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
