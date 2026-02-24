"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Shield, Loader2, RefreshCw, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { detectAnomalies } from "@/lib/actions/ai.action";
import { toast } from "sonner";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function AnomalyDetectionPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  useEffect(() => {
    runScan();
  }, []);

  const runScan = async () => {
    setIsScanning(true);
    try {
      const result = await detectAnomalies();
      if (result.success) {
        setAnomalies(result.anomalies || []);
        setLastScan(new Date());
        toast.success(`Scan complete: ${result.anomalies?.length || 0} anomalies found`);
      } else {
        toast.error(result.error || "Scan failed");
      }
    } catch (error) {
      toast.error("Failed to run scan");
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      high: "bg-red-100 text-red-700 border-red-300",
      medium: "bg-amber-100 text-amber-700 border-amber-300",
      low: "bg-blue-100 text-blue-700 border-blue-300",
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === "high") return <AlertCircle className="h-5 w-5 text-red-600" />;
    if (severity === "medium") return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    return <AlertCircle className="h-5 w-5 text-blue-600" />;
  };

  const stats = {
    total: anomalies.length,
    high: anomalies.filter(a => a.severity === "high").length,
    medium: anomalies.filter(a => a.severity === "medium").length,
    low: anomalies.filter(a => a.severity === "low").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Anomaly Detection"
          description="AI-powered fraud and error detection"
        />
        <Button
          onClick={runScan}
          disabled={isScanning}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
        >
          {isScanning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Scan
            </>
          )}
        </Button>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anomalies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            {lastScan && (
              <p className="text-xs text-muted-foreground mt-1">
                Last scan: {lastScan.toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.high}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires immediate action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Severity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.medium}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Review recommended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Severity</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.low}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Monitor for patterns
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detected Anomalies</CardTitle>
          <CardDescription>
            AI has identified the following unusual patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isScanning ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            </div>
          ) : anomalies.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto text-emerald-600 mb-4" />
              <p className="text-lg font-semibold mb-2">All Clear!</p>
              <p className="text-sm text-muted-foreground">
                No anomalies detected in your recent transactions
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {anomalies.map((anomaly, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${getSeverityColor(anomaly.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getSeverityIcon(anomaly.severity)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{anomaly.type.replace(/_/g, " ").toUpperCase()}</h3>
                          <Badge variant="outline" className="text-xs">
                            {anomaly.severity}
                          </Badge>
                        </div>
                        <p className="text-sm mt-1">{anomaly.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      {new Date(anomaly.date).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Mark as Reviewed
                      </Button>
                      <Button size="sm" variant="ghost">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200">
        <CardHeader>
          <CardTitle className="text-lg">What We Detect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                Unusual Amounts
              </h4>
              <p className="text-sm text-muted-foreground">
                Transactions significantly higher than historical averages (2σ deviation)
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Duplicates
              </h4>
              <p className="text-sm text-muted-foreground">
                Same amount, vendor, and date within 24 hours
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Fraud Patterns
              </h4>
              <p className="text-sm text-muted-foreground">
                Suspicious patterns and unusual transaction sequences
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
