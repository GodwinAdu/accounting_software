import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getTrialBalance } from "@/lib/actions/report.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { redirect } from "next/navigation";

export default async function TrialBalancePage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("reports_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getTrialBalance();
  const data = result.data?.accounts || [];
  const totalDebit = result.data?.totalDebit || 0;
  const totalCredit = result.data?.totalCredit || 0;
  const isBalanced = result.data?.isBalanced || false;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Trial Balance"
          description="List of all accounts with debit and credit balances"
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

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Debits</p>
            <p className="text-2xl font-bold text-emerald-600">GHS {totalDebit.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Credits</p>
            <p className="text-2xl font-bold text-blue-600">GHS {totalCredit.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className={`text-2xl font-bold ${isBalanced ? 'text-emerald-600' : 'text-red-600'}`}>
              {isBalanced ? '✓ Balanced' : '✗ Not Balanced'}
            </p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
