"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIButton } from "@/components/ai/ai-button";
import { segmentCustomers } from "@/lib/actions/ai.action";
import { toast } from "sonner";
import { Users, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";

export function CustomerSegmentation() {
  const [loading, setLoading] = useState(false);
  const [segments, setSegments] = useState<any[]>([]);

  const handleSegment = async () => {
    setLoading(true);
    try {
      const result = await segmentCustomers();
      if (result.success) {
        setSegments(result.segments?.segments || []);
      } else {
        toast.error(result.error || "Failed to segment customers");
      }
    } catch (error) {
      toast.error("Failed to segment customers");
    } finally {
      setLoading(false);
    }
  };

  const segmentIcons: any = {
    "High-value": TrendingUp,
    Regular: Users,
    "At-risk": AlertTriangle,
    New: Sparkles,
  };

  const segmentColors: any = {
    "High-value": "bg-emerald-100 text-emerald-700 border-emerald-200",
    Regular: "bg-blue-100 text-blue-700 border-blue-200",
    "At-risk": "bg-orange-100 text-orange-700 border-orange-200",
    New: "bg-purple-100 text-purple-700 border-purple-200",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">AI Customer Segmentation</CardTitle>
          <AIButton onClick={handleSegment} loading={loading}>
            Analyze Customers
          </AIButton>
        </div>
      </CardHeader>
      <CardContent>
        {segments.length > 0 ? (
          <div className="grid gap-3">
            {segments.map((segment, index) => {
              const Icon = segmentIcons[segment.name] || Users;
              const colorClass = segmentColors[segment.name] || "bg-gray-100 text-gray-700";

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${colorClass}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <h3 className="font-semibold">{segment.name}</h3>
                    </div>
                    <Badge variant="secondary" className="bg-white/50">
                      {segment.count} customers
                    </Badge>
                  </div>
                  <p className="text-sm opacity-90">{segment.characteristics}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            Click "Analyze Customers" to segment your customer base using AI
          </p>
        )}
      </CardContent>
    </Card>
  );
}
