import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, AlertTriangle, TrendingUp, RefreshCw, MessageSquare, Zap, Brain, Target } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function AIToolsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const tools = [
    {
      title: "AI Chat Assistant",
      description: "Get instant answers to accounting questions, financial guidance, and feature help",
      icon: MessageSquare,
      href: `/${organizationId}/dashboard/${userId}/ai`,
      color: "emerald",
      features: ["24/7 Support", "Context-Aware", "Voice Input", "Chat History"],
      status: "active",
    },
    {
      title: "Smart Search",
      description: "Search invoices, expenses, and customers using natural language queries",
      icon: Target,
      href: `/${organizationId}/dashboard/${userId}/ai/search`,
      color: "indigo",
      features: ["Natural Language", "Quick Filters", "Smart Results", "Instant Answers"],
      status: "new",
    },
    {
      title: "Smart Expense Categorization",
      description: "AI automatically categorizes expenses based on description and historical patterns",
      icon: Sparkles,
      href: `/${organizationId}/dashboard/${userId}/expenses/all/new`,
      color: "blue",
      features: ["Auto-Categorize", "Learn Patterns", "High Accuracy", "Tag Suggestions"],
      status: "active",
    },
    {
      title: "Invoice Data Extraction (OCR)",
      description: "Upload invoice images and extract vendor, amount, date, and line items automatically",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/ai/ocr`,
      color: "purple",
      features: ["Image Upload", "PDF Support", "Auto-Fill Forms", "GPT-4 Vision"],
      status: "active",
    },
    {
      title: "Anomaly Detection",
      description: "Detect unusual transactions, duplicates, fraud patterns, and budget overruns",
      icon: AlertTriangle,
      href: `/${organizationId}/dashboard/${userId}/ai/anomalies`,
      color: "red",
      features: ["Fraud Detection", "Duplicate Check", "Unusual Amounts", "Real-time Alerts"],
      status: "active",
    },
    {
      title: "Financial Forecasting",
      description: "Predict revenue, expenses, and cash flow based on historical trends and patterns",
      icon: TrendingUp,
      href: `/${organizationId}/dashboard/${userId}/ai/forecast`,
      color: "green",
      features: ["Revenue Prediction", "Expense Trends", "Cash Flow", "Seasonal Patterns"],
      status: "active",
    },
    {
      title: "Smart Reconciliation",
      description: "Auto-match bank transactions with invoices and expenses for faster reconciliation",
      icon: RefreshCw,
      href: `/${organizationId}/dashboard/${userId}/ai/reconcile`,
      color: "cyan",
      features: ["Auto-Match", "Smart Suggestions", "Discrepancy Detection", "Learn from Corrections"],
      status: "active",
    },
    {
      title: "Financial Insights",
      description: "AI-generated insights on financial health, risks, and optimization opportunities",
      icon: Brain,
      href: `/${organizationId}/dashboard/${userId}/ai-assistant`,
      color: "amber",
      features: ["Health Score", "Risk Analysis", "Cost Optimization", "Growth Suggestions"],
      status: "active",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: any = {
      emerald: "from-emerald-500 to-teal-500",
      indigo: "from-indigo-500 to-purple-500",
      blue: "from-blue-500 to-cyan-500",
      purple: "from-purple-500 to-pink-500",
      red: "from-red-500 to-orange-500",
      green: "from-green-500 to-emerald-500",
      cyan: "from-cyan-500 to-blue-500",
      amber: "from-amber-500 to-orange-500",
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="space-y-6">
      <Heading 
        title="AI-Powered Tools" 
        description="Leverage artificial intelligence to automate tasks and gain insights"
      />
      <Separator />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card key={tool.title} className="relative overflow-hidden group hover:shadow-lg transition-all">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getColorClasses(tool.color)}`} />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses(tool.color)} flex items-center justify-center shadow-md`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className={tool.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}>
                    {tool.status === 'new' ? 'New' : 'Active'}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {tool.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Zap className="h-3 w-3 text-emerald-600" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={tool.href}>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      Launch Tool
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Why Use AI Tools?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Save Time</h3>
              <p className="text-sm text-muted-foreground">
                Automate repetitive tasks like data entry, categorization, and reconciliation
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Reduce Errors</h3>
              <p className="text-sm text-muted-foreground">
                AI detects anomalies, duplicates, and unusual patterns that humans might miss
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Gain Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get predictive analytics and actionable recommendations for better decisions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
