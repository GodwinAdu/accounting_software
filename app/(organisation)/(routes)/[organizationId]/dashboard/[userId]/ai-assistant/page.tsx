"use client";

import { useState, useEffect } from "react";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, AlertCircle, TrendingUp, Brain, Sparkles, Loader2 } from "lucide-react";
import { getFinancialInsights } from "@/lib/actions/ai.action";
import { toast } from "sonner";

export default function AIAssistantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      const data = await getFinancialInsights();
      setResult(data);
      if (data.success) {
        toast.success("Insights generated successfully");
      } else {
        toast.error(data.error || "Failed to generate insights");
      }
    } catch (error) {
      toast.error("Failed to generate insights");
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = {
    totalRevenue: result?.metrics?.totalRevenue || 0,
    totalExpenses: result?.metrics?.totalExpenses || 0,
    cashFlow: (result?.metrics?.totalRevenue || 0) - (result?.metrics?.totalExpenses || 0),
  };

  const healthScore = result?.success ? Math.min(100, Math.max(0, 50 + (result.metrics?.profitMargin || 0))) : 0;

  return (
    <div className="space-y-6">
      <Heading title="AI Assistant" description="Smart financial insights and recommendations" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Health</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${healthScore >= 70 ? 'text-emerald-600' : healthScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
              {healthScore}/100
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {healthScore >= 70 ? 'Excellent' : healthScore >= 40 ? 'Good' : 'Needs attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Insights</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{result ? 1 : 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{result?.metrics?.overdueInvoices || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Require action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{result?.metrics?.profitMargin || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">Current margin</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Revenue (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">GHS {metrics.totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Expenses (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">GHS {metrics.totalExpenses.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Net Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${metrics.cashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              GHS {metrics.cashFlow.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>AI Insights & Recommendations</CardTitle>
          <Button 
            onClick={generateInsights} 
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Insights
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-muted-foreground">Analyzing your financial data...</p>
            </div>
          ) : !result ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Click "Generate Insights" to analyze your data</p>
              <p className="text-sm text-muted-foreground mt-2">AI will provide personalized financial recommendations</p>
            </div>
          ) : !result.success ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <p className="text-muted-foreground">Failed to generate insights</p>
              <p className="text-sm text-muted-foreground mt-2">{result.error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">AI-Generated Financial Insights</h3>
                    <p className="text-sm text-muted-foreground">Based on your recent financial data</p>
                  </div>
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{result.insights}</div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      Net Income
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">GHS {result.metrics?.netIncome?.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      Total Overdue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600">GHS {result.metrics?.totalOverdue?.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
