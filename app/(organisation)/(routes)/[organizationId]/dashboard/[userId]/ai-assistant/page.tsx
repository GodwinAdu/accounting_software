import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, AlertCircle, TrendingUp, Brain, Sparkles, CheckCircle } from "lucide-react";
import { getAIInsights } from "@/lib/actions/ai.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function AIAssistantPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  // const hasViewPermission = await checkPermission("aiAssistant_view");
  // if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const { insights, summary, metrics } = await getAIInsights();
  const { newInsights, criticalInsights, totalImpact, healthScore } = summary;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fraud_alert": return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "cash_flow": return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case "tax_optimization": return <Sparkles className="h-5 w-5 text-purple-600" />;
      default: return <Lightbulb className="h-5 w-5 text-yellow-600" />;
    }
  };

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
            <div className="text-2xl font-bold">{newInsights}</div>
            <p className="text-xs text-muted-foreground mt-1">Unread</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalInsights}</div>
            <p className="text-xs text-muted-foreground mt-1">Require action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Impact</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {totalImpact.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Savings opportunity</p>
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
          <Button size="sm">Generate Insights</Button>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No insights generated yet</p>
              <p className="text-sm text-muted-foreground mt-2">AI will analyze your data and provide recommendations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight: any) => (
                <div key={insight._id} className={`p-4 border rounded-lg ${getSeverityColor(insight.severity)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(insight.type)}
                      <div>
                        <h3 className="font-semibold">{insight.title}</h3>
                        <p className="text-sm mt-1">{insight.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={insight.severity === "critical" ? "destructive" : "outline"}>
                        {insight.severity}
                      </Badge>
                      {insight.status === "actioned" && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium mb-1">Recommendation:</p>
                    <p className="text-sm">{insight.recommendation}</p>
                    {insight.impact > 0 && (
                      <p className="text-sm font-medium text-emerald-600 mt-2">
                        Potential savings: GHS {insight.impact.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Mark as Actioned</Button>
                    <Button size="sm" variant="ghost">Dismiss</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
