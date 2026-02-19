import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getAccounts } from "@/lib/actions/account.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { redirect } from "next/navigation";

export default async function TaxSummaryPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("reports_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getAccounts();
  const accounts = result.data || [];

  const vatAccount = accounts.find((a: any) => a.accountName === "VAT Payable");
  const payeAccount = accounts.find((a: any) => a.accountName === "PAYE Payable");
  const ssnitAccount = accounts.find((a: any) => a.accountName === "SSNIT Payable");

  const vatPayable = vatAccount?.currentBalance || 0;
  const payePayable = payeAccount?.currentBalance || 0;
  const ssnitPayable = ssnitAccount?.currentBalance || 0;
  const totalPayable = vatPayable + payePayable + ssnitPayable;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Tax Summary Report"
          description="Comprehensive tax overview"
        />
        <div className="flex gap-3">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Separator />

      <div className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>VAT Summary (12.5%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between py-2 font-bold border-t pt-2">
                <span>Net VAT Payable</span>
                <span className="text-red-600">GHS {vatPayable.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PAYE (Employee Income Tax)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between py-2 font-bold border-t pt-2">
                <span>Outstanding PAYE</span>
                <span className={payePayable > 0 ? "text-red-600" : "text-emerald-600"}>
                  GHS {payePayable.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SSNIT (Social Security)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between py-2 font-bold border-t pt-2">
                <span>Outstanding SSNIT</span>
                <span className={ssnitPayable > 0 ? "text-red-600" : "text-emerald-600"}>
                  GHS {ssnitPayable.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-600">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">Total Tax Payable</span>
              <span className="text-3xl font-bold text-red-600">
                GHS {totalPayable.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Total outstanding tax liabilities across all categories
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
