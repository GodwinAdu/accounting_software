"use client";

import { useState } from "react";
import { RefreshCw, Loader2, CheckCircle, Link as LinkIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { smartReconcile } from "@/lib/actions/ai.action";
import { toast } from "sonner";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ReconcilePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState("");
  const [matches, setMatches] = useState<any[]>([]);

  const handleReconcile = async () => {
    if (!transactions.trim()) {
      toast.error("Please enter bank transactions");
      return;
    }

    setIsProcessing(true);
    try {
      const txnArray = transactions.split("\n").filter(line => line.trim()).map(line => {
        const parts = line.split(",");
        return {
          date: parts[0]?.trim(),
          description: parts[1]?.trim(),
          amount: parseFloat(parts[2]?.trim() || "0"),
        };
      });

      const result = await smartReconcile(txnArray);
      if (result.success) {
        setMatches(result.matches || []);
        toast.success(`Found ${result.matches?.length || 0} matches`);
      } else {
        toast.error(result.error || "Reconciliation failed");
      }
    } catch (error) {
      toast.error("Failed to process transactions");
    } finally {
      setIsProcessing(false);
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

  const stats = {
    total: matches.length,
    high: matches.filter(m => m.confidence === "high").length,
    medium: matches.filter(m => m.confidence === "medium").length,
    low: matches.filter(m => m.confidence === "low").length,
  };

  return (
    <div className="space-y-6">
      <Heading
        title="Smart Reconciliation"
        description="AI-powered transaction matching"
      />
      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bank Transactions</CardTitle>
            <CardDescription>
              Enter bank transactions (one per line: date, description, amount)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Transaction Data</Label>
              <Textarea
                value={transactions}
                onChange={(e) => setTransactions(e.target.value)}
                placeholder="2024-01-15, Office Supplies, -250.00&#10;2024-01-16, Client Payment, 1500.00&#10;2024-01-17, Rent Payment, -2000.00"
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Format: YYYY-MM-DD, Description, Amount
              </p>
            </div>
            <Button
              onClick={handleReconcile}
              disabled={isProcessing || !transactions.trim()}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Matching...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Find Matches
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Match Statistics</CardTitle>
            <CardDescription>
              AI-matched transactions summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Matches</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">High Confidence</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.high}</p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Medium Confidence</p>
                <p className="text-3xl font-bold text-amber-600">{stats.medium}</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Low Confidence</p>
                <p className="text-3xl font-bold text-red-600">{stats.low}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matched Transactions</CardTitle>
          <CardDescription>
            AI has matched these bank transactions with your records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-12">
              <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">
                Enter bank transactions to find matches
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <LinkIcon className="h-5 w-5 text-cyan-600" />
                      <div>
                        <h3 className="font-semibold">{match.transaction.description}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getConfidenceBadge(match.confidence)}>
                            {match.confidence} confidence
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {match.transaction.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${match.transaction.amount >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        GHS {Math.abs(match.transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {match.transaction.amount >= 0 ? "Credit" : "Debit"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium">Matched with:</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium capitalize">{match.match.type}</p>
                        <p className="text-xs text-muted-foreground">ID: {match.match.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Record
                        </Button>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Confirm Match
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-cyan-200">
        <CardHeader>
          <CardTitle className="text-lg">How Matching Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Amount Matching</h4>
              <p className="text-sm text-muted-foreground">
                Matches transactions with identical or very close amounts (±GHS 0.01)
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Date Proximity</h4>
              <p className="text-sm text-muted-foreground">
                Considers transactions within ±7 days of each other
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Learning System</h4>
              <p className="text-sm text-muted-foreground">
                AI learns from your confirmations to improve future matches
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
