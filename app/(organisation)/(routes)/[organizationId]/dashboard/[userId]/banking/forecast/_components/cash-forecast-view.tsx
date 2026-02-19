"use client";

import { TrendingUp, TrendingDown, AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CashForecastViewProps {
  forecast: any;
}

export default function CashForecastView({ forecast }: CashForecastViewProps) {
  if (!forecast) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Unable to load forecast data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { currentBalance, forecast30, forecast60, forecast90, projections } = forecast;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {currentBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">As of today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">30-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {forecast30.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +{Math.round(((forecast30 - currentBalance) / currentBalance) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">60-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">GHS {forecast60.toLocaleString()}</div>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +{Math.round(((forecast60 - currentBalance) / currentBalance) * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">90-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">GHS {forecast90.toLocaleString()}</div>
            <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +{Math.round(((forecast90 - currentBalance) / currentBalance) * 100)}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>4-Week Cash Flow Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projections.map((proj: any, idx: number) => (
                  <div key={idx} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{proj.period}</span>
                        <Badge className={proj.status === "healthy" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                          {proj.status}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold">GHS {proj.balance.toLocaleString()}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Expected Inflow</p>
                        <p className="font-semibold text-emerald-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          GHS {proj.inflow.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expected Outflow</p>
                        <p className="font-semibold text-red-600 flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          GHS {proj.outflow.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Monthly projections coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Scenario planning coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
