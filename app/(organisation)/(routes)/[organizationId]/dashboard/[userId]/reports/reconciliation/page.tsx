import { AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getReconciliationReport } from "@/lib/actions/reconciliation.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { redirect } from "next/navigation";
import { RecalculateButton } from "./_components/recalculate-button";

export default async function ReconciliationPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("reports_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getReconciliationReport();
  const data = result.data || { totalIssues: 0, issues: [], isHealthy: true };

  const highIssues = data.issues.filter((i: any) => i.severity === "high");
  const mediumIssues = data.issues.filter((i: any) => i.severity === "medium");
  const lowIssues = data.issues.filter((i: any) => i.severity === "low");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Account Reconciliation"
          description="Identify and fix accounting discrepancies"
        />
        <RecalculateButton />
      </div>
      <Separator />

      <div className="max-w-4xl space-y-6">
        {data.isHealthy ? (
          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-900">All Clear!</AlertTitle>
            <AlertDescription className="text-emerald-700">
              Your accounts are balanced and no issues were detected.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Issues Detected</AlertTitle>
            <AlertDescription>
              Found {data.totalIssues} issue(s) that need attention. Review and fix them below.
            </AlertDescription>
          </Alert>
        )}

        {highIssues.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">High Priority Issues ({highIssues.length})</CardTitle>
              <CardDescription>These issues must be fixed immediately</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {highIssues.map((issue: any, i: number) => (
                <div key={i} className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-semibold text-red-900">{issue.description}</h4>
                  <div className="mt-2 text-sm text-red-700 space-y-1">
                    {issue.type === "trial_balance_unbalanced" && (
                      <>
                        <p>Total Debit: GHS {issue.details.totalDebit.toLocaleString()}</p>
                        <p>Total Credit: GHS {issue.details.totalCredit.toLocaleString()}</p>
                        <p className="font-semibold">Difference: GHS {Math.abs(issue.details.difference).toLocaleString()}</p>
                        <p className="mt-2 text-xs">This indicates account balance mismatches. Click "Recalculate All Balances" to fix.</p>
                      </>
                    )}
                    {issue.type === "unbalanced_entry" && (
                      <>
                        <p>Entry Number: {issue.details.entryNumber}</p>
                        <p>Total Debit: GHS {issue.details.totalDebit.toLocaleString()}</p>
                        <p>Total Credit: GHS {issue.details.totalCredit.toLocaleString()}</p>
                        <p className="font-semibold">Difference: GHS {Math.abs(issue.details.difference).toLocaleString()}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {mediumIssues.length > 0 && (
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-700">Medium Priority Issues ({mediumIssues.length})</CardTitle>
              <CardDescription>Account balance mismatches - can be auto-fixed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mediumIssues.map((issue: any, i: number) => (
                <div key={i} className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <h4 className="font-semibold text-orange-900">{issue.description}</h4>
                  <div className="mt-2 text-sm text-orange-700 space-y-1">
                    {issue.type === "balance_mismatch" && (
                      <>
                        <p>Account: {issue.details.accountCode} - {issue.details.accountName}</p>
                        <p>Recorded Debit: GHS {issue.details.recordedDebit.toLocaleString()}</p>
                        <p>Calculated Debit: GHS {issue.details.calculatedDebit.toLocaleString()}</p>
                        <p>Recorded Credit: GHS {issue.details.recordedCredit.toLocaleString()}</p>
                        <p>Calculated Credit: GHS {issue.details.calculatedCredit.toLocaleString()}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {lowIssues.length > 0 && (
          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-700">Low Priority Issues ({lowIssues.length})</CardTitle>
              <CardDescription>Minor issues that should be reviewed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {lowIssues.map((issue: any, i: number) => (
                <div key={i} className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <h4 className="font-semibold text-yellow-900">{issue.description}</h4>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>{issue.details.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>How to Fix Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Trial Balance Unbalanced (High Priority)</h4>
              <p className="text-muted-foreground">
                Total debits don't equal total credits. This is usually caused by account balance mismatches. Click "Recalculate All Balances" to automatically fix.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Unbalanced Journal Entries (High Priority)</h4>
              <p className="text-muted-foreground">
                These entries violate double-entry bookkeeping. You need to manually review and correct the journal entry to ensure debits equal credits.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Balance Mismatches (Medium Priority)</h4>
              <p className="text-muted-foreground">
                Account balances don't match the sum of GL transactions. Click "Recalculate All Balances" button above to automatically fix these.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Orphaned Entries (Low Priority)</h4>
              <p className="text-muted-foreground">
                GL entries reference deleted journal entries. These should be reviewed and potentially removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
