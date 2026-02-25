import { Metadata } from "next";
import Link from "next/link";
import { FileText, TrendingUp, DollarSign, Calendar, FileBarChart, Scale, Receipt, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reports | FindIT",
  description: "Financial reports and analytics",
};

const reports = [
  {
    title: "Profit & Loss",
    description: "Income statement showing revenue and expenses",
    icon: TrendingUp,
    href: "reports/profit-loss",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Balance Sheet",
    description: "Assets, liabilities, and equity overview",
    icon: Scale,
    href: "reports/balance-sheet",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Cash Flow",
    description: "Cash inflows and outflows analysis",
    icon: DollarSign,
    href: "reports/cash-flow",
    color: "text-green-600 dark:text-green-400",
  },
  {
    title: "Trial Balance",
    description: "Debit and credit balances verification",
    icon: FileBarChart,
    href: "reports/trial-balance",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "General Ledger",
    description: "Complete transaction history by account",
    icon: FileText,
    href: "reports/general-ledger",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "AR Aging",
    description: "Accounts receivable aging summary",
    icon: Calendar,
    href: "reports/ar-aging",
    color: "text-cyan-600 dark:text-cyan-400",
  },
  {
    title: "AP Aging",
    description: "Accounts payable aging summary",
    icon: Calendar,
    href: "reports/ap-aging",
    color: "text-pink-600 dark:text-pink-400",
  },
  {
    title: "Tax Summary",
    description: "Tax liability and payment summary",
    icon: Receipt,
    href: "reports/tax-summary",
    color: "text-red-600 dark:text-red-400",
  },
  {
    title: "Reconciliation",
    description: "Bank reconciliation reports",
    icon: Shield,
    href: "reports/reconciliation",
    color: "text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Audit Trail",
    description: "Complete audit log and activity history",
    icon: Shield,
    href: "reports/audit",
    color: "text-gray-600 dark:text-gray-400",
  },
];

export default function ReportsPage({ params }: { params: { organizationId: string; userId: string } }) {
  const { organizationId, userId } = params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-2">
          Access financial reports and analytics for your business
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Link
              key={report.href}
              href={`/${organizationId}/dashboard/${userId}/${report.href}`}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${report.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{report.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
