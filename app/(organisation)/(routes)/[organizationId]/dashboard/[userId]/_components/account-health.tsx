"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const healthMetrics = [
  {
    label: "Cash Runway",
    value: "8.5 months",
    percentage: 85,
    description: "Based on current burn rate",
    icon: Activity,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    label: "Burn Rate",
    value: "GHS 18,000/mo",
    percentage: 60,
    description: "Average monthly expenses",
    icon: TrendingDown,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    label: "Profit Margin",
    value: "34.2%",
    percentage: 68,
    description: "Net profit percentage",
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
];

export default function AccountHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {healthMetrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 ${metric.bgColor}`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              </div>
              <p className="text-lg font-bold">{metric.value}</p>
            </div>
            <Progress value={metric.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
