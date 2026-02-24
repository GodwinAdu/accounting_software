import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AuditReportsPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("reports_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const auditReports = [
    {
      title: "Trial Balance",
      description: "Verify that total debits equal total credits",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/reports/trial-balance`,
      category: "Financial Statements",
    },
    {
      title: "Balance Sheet",
      description: "Assets, Liabilities, and Equity at a point in time",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/reports/balance-sheet`,
      category: "Financial Statements",
    },
    {
      title: "Profit & Loss Statement",
      description: "Revenue and expenses for a period",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/reports/profit-loss`,
      category: "Financial Statements",
    },
    {
      title: "Cash Flow Statement",
      description: "Operating, investing, and financing activities",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/reports/cash-flow`,
      category: "Financial Statements",
    },
    {
      title: "General Ledger",
      description: "Complete record of all financial transactions",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/accounting/general-ledger`,
      category: "Transaction Records",
    },
    {
      title: "Journal Entries",
      description: "All journal entries with supporting documentation",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/accounting/journal-entries`,
      category: "Transaction Records",
    },
    {
      title: "Chart of Accounts",
      description: "Complete list of all accounts used",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/accounting/chart-of-accounts`,
      category: "Account Structure",
    },
    {
      title: "Accounts Receivable Aging",
      description: "Outstanding customer invoices by age",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/reports/ar-aging`,
      category: "Receivables",
    },
    {
      title: "Accounts Payable Aging",
      description: "Outstanding vendor bills by age",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/reports/ap-aging`,
      category: "Payables",
    },
    {
      title: "Audit Trail",
      description: "Complete log of all user actions and changes",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/settings/company?tab=audit-logs`,
      category: "Audit & Compliance",
    },
    {
      title: "Account Reconciliation",
      description: "Identify and fix accounting discrepancies",
      icon: FileText,
      href: `/${organizationId}/dashboard/${userId}/reports/reconciliation`,
      category: "Audit & Compliance",
    },
  ];

  const categories = Array.from(new Set(auditReports.map(r => r.category)));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Audit Reports"
          description="Comprehensive reports for auditors and compliance"
        />
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Select Period
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>
      <Separator />

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-4">{category}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {auditReports
                .filter((report) => report.category === category)
                .map((report) => (
                  <Link key={report.title} href={report.href}>
                    <Card className="hover:border-emerald-600 transition-colors cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <report.icon className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{report.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{report.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Audit Checklist</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p className="font-semibold">For External Auditors:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Review Trial Balance to ensure debits = credits</li>
            <li>Verify Balance Sheet equation (Assets = Liabilities + Equity)</li>
            <li>Examine General Ledger for unusual transactions</li>
            <li>Check Journal Entries for proper authorization</li>
            <li>Review Audit Trail for any unauthorized changes</li>
            <li>Reconcile bank statements with Cash accounts</li>
            <li>Verify AR/AP aging reports with supporting documents</li>
            <li>Confirm Cash Flow Statement ties to Balance Sheet changes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
