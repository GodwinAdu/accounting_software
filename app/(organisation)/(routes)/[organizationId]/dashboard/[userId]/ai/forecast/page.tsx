"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Loader2, Calendar, DollarSign, BarChart3, Sparkles, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { forecastFinancials } from "@/lib/actions/ai.action";
import { toast } from "sonner";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ForecastPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [forecast, setForecast] = useState<any>(null);
  const [months, setMonths] = useState("3");

  useEffect(() => {
    generateForecast();
  }, []);

  const generateForecast = async () => {
    setIsLoading(true);
    try {
      const result = await forecastFinancials(parseInt(months));
      if (result.success) {
        setForecast(result);
        toast.success("Forecast generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate forecast");
      }
    } catch (error) {
      toast.error("Failed to generate forecast");
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: "bg-emerald-100 text-emerald-700",
      medium: "bg-amber-100 text-amber-700",
      low: "bg-red-100 text-red-700",
    };
    return colors[confidence as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Financial Forecasting"
          description="AI-powered revenue and expense predictions"
        />
        <div className="flex items-center gap-2">
          <Select value={months} onValueChange={setMonths}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Months</SelectItem>
              <SelectItem value="6">6 Months</SelectItem>
              <SelectItem value="12">12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={generateForecast}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Forecast
              </>
            )}
          </Button>
        </div>
      </div>
      <Separator />

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Analyzing historical data and generating predictions...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : !forecast ? (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Click "Generate Forecast" to see predictions
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  GHS {(forecast.forecast?.reduce((sum: number, f: any) => sum + f.revenue, 0) / forecast.forecast?.length || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Predicted average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Monthly Expenses</CardTitle>
                <DollarSign className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  GHS {(forecast.forecast?.reduce((sum: number, f: any) => sum + f.expenses, 0) / forecast.forecast?.length || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Predicted average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trend Analysis</CardTitle>
                {forecast.trend === 'growing' ? <TrendingUp className="h-4 w-4 text-emerald-600" /> : 
                 forecast.trend === 'declining' ? <TrendingDown className="h-4 w-4 text-red-600" /> : 
                 <BarChart3 className="h-4 w-4 text-blue-600" />}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold capitalize ${
                  forecast.trend === 'growing' ? 'text-emerald-600' : 
                  forecast.trend === 'declining' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {forecast.trend || 'Stable'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Overall business trend
                </p>
              </CardContent>
            </Card>
          </div>

          {forecast.historical && forecast.historical.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue & Expenses Trend</CardTitle>
                  <CardDescription>
                    Historical data (last 6 months) vs AI forecast (next {months} months)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[...forecast.historical.map((h: any) => ({ ...h, type: 'Historical' })), ...forecast.forecast.map((f: any) => ({ ...f, type: 'Forecast' }))]}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        tickFormatter={(value) => new Date(value + '-01').toLocaleDateString('en-US', { month: 'short' })}
                        className="text-xs"
                      />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        formatter={(value: any) => `GHS ${value.toLocaleString()}`}
                        labelFormatter={(label) => new Date(label + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Net Income Comparison</CardTitle>
                  <CardDescription>
                    Bar chart showing historical vs forecasted net income
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      ...forecast.historical.map((h: any) => ({ 
                        month: h.month, 
                        netIncome: h.revenue - h.expenses,
                        type: 'Historical'
                      })), 
                      ...forecast.forecast.map((f: any) => ({ 
                        month: f.month, 
                        netIncome: f.revenue - f.expenses,
                        type: 'Forecast'
                      }))
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        tickFormatter={(value) => new Date(value + '-01').toLocaleDateString('en-US', { month: 'short' })}
                        className="text-xs"
                      />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        formatter={(value: any) => `GHS ${value.toLocaleString()}`}
                        labelFormatter={(label) => new Date(label + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      />
                      <Legend />
                      <Bar dataKey="netIncome" fill="#3b82f6" name="Net Income" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Monthly Forecast</CardTitle>
              <CardDescription>
                AI-predicted revenue and expenses for the next {months} months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {forecast.forecast?.map((month: any, index: number) => {
                  const netIncome = month.revenue - month.expenses;
                  const prevMonth = index > 0 ? forecast.forecast[index - 1] : null;
                  const revenueChange = prevMonth ? ((month.revenue - prevMonth.revenue) / prevMonth.revenue * 100) : 0;
                  const expenseChange = prevMonth ? ((month.expenses - prevMonth.expenses) / prevMonth.expenses * 100) : 0;
                  
                  return (
                    <div key={index} className="p-4 border rounded-lg hover:bg-accent transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {new Date(month.month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <Badge className={getConfidenceBadge(month.confidence)} variant="secondary">
                              {month.confidence?.toUpperCase()} CONFIDENCE
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Net Income</p>
                          <p className={`text-2xl font-bold ${netIncome >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                            GHS {netIncome.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">Revenue</p>
                            {prevMonth && (
                              <div className={`flex items-center text-xs ${revenueChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {revenueChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {Math.abs(revenueChange).toFixed(1)}%
                              </div>
                            )}
                          </div>
                          <p className="text-lg font-bold text-emerald-600">
                            GHS {month.revenue?.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">Expenses</p>
                            {prevMonth && (
                              <div className={`flex items-center text-xs ${expenseChange >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                {expenseChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {Math.abs(expenseChange).toFixed(1)}%
                              </div>
                            )}
                          </div>
                          <p className="text-lg font-bold text-red-600">
                            GHS {month.expenses?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {forecast.insights && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{forecast.insights}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
