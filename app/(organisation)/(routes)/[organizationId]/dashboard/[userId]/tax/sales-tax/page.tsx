import { FileText, ExternalLink } from "lucide-react";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getAccounts } from "@/lib/actions/account.action";
import { getVATFilings } from "@/lib/actions/vat-filing.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { redirect } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { VATFilingHistory } from "./_components/vat-filing-history";

export default async function SalesTaxPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("tax_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getAccounts();
  const accounts = result.data || [];

  const vatAccount = accounts.find((a: any) => a.accountName === "VAT Payable");
  const vatPayable = vatAccount?.currentBalance || 0;

  const filingsResult = await getVATFilings();
  const filings = filingsResult.data || [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="VAT / Sales Tax"
          description="Manage VAT returns and compliance (Ghana GRA)"
        />
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-1">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Net VAT Payable</p>
            <p className="text-2xl font-bold text-red-600">GHS {vatPayable.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Amount due to GRA</p>
          </div>
        </div>
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription className="space-y-3">
          <p>
            <strong>Direct GRA integration coming soon.</strong> Currently, you need to file VAT manually:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Note the VAT Payable amount above (GHS {vatPayable.toLocaleString()})</li>
            <li>Visit <a href="https://gra.gov.gh" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">gra.gov.gh <ExternalLink className="h-3 w-3" /></a> and log in with your TIN</li>
            <li>Submit your VAT return through GRA's portal</li>
            <li>After payment, record it in PayFlow: <Link href={`/${organizationId}/dashboard/${userId}/accounting/journal-entries`} className="text-blue-600 hover:underline">Create Journal Entry</Link> (Debit: VAT Payable, Credit: Bank)</li>
          </ol>
        </AlertDescription>
      </Alert>

      <div className="rounded-lg border bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Ghana VAT Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              Standard VAT rate: 12.5% (NHIL 2.5% + GETFund 2.5% + VAT Flat Rate 3% + COVID-19 Health Recovery Levy 1%)
              <br />
              VAT returns must be filed monthly by the 15th of the following month.
            </p>
          </div>
        </div>
      </div>

      <VATFilingHistory filings={filings} currentVATPayable={vatPayable} />
    </div>
  );
}
