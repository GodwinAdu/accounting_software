"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIInsightCardProps {
  title: string;
  content: string | React.ReactNode;
  confidence?: "high" | "medium" | "low";
  className?: string;
}

export function AIInsightCard({ title, content, confidence, className }: AIInsightCardProps) {
  const confidenceColors = {
    high: "bg-emerald-100 text-emerald-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-orange-100 text-orange-700",
  };

  return (
    <Card className={cn("border-emerald-200 bg-emerald-50/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            {title}
          </CardTitle>
          {confidence && (
            <Badge className={confidenceColors[confidence]} variant="secondary">
              {confidence} confidence
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {typeof content === "string" ? (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
        ) : (
          content
        )}
      </CardContent>
    </Card>
  );
}
