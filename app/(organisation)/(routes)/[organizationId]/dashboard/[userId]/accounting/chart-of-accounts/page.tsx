import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getAccounts, getChartOfAccountsSummary, initializeDefaultAccounts } from "@/lib/actions/account.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ChartOfAccountsPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("chartOfAccounts_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const hasCreatePermission = await checkPermission("chartOfAccounts_create");

  const [accountsResult, summaryResult] = await Promise.all([
    getAccounts(),
    getChartOfAccountsSummary(),
  ]);

  const accounts = accountsResult.data || [];
  const summary = summaryResult.data || { totalAccounts: 0, activeAccounts: 0, assets: 0, liabilities: 0, equity: 0 };

  const formattedAccounts = accounts.map((acc: any) => ({
    _id: acc._id,
    id: acc._id,
    code: acc.accountCode,
    name: acc.accountName,
    type: acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1),
    subType: acc.accountSubType.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    balance: acc.currentBalance,
    status: acc.isActive ? "active" : "inactive",
    isSystemAccount: acc.isSystemAccount,
    parentAccount: acc.parentAccountId?.accountName || "",
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`Chart of Accounts (${summary.totalAccounts})`}
          description="Manage your accounting structure and accounts"
        />
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          {/* {hasCreatePermission && ( */}
            <Link href={`/${organizationId}/dashboard/${userId}/accounting/chart-of-accounts/new`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </Link>
          {/* )} */}
        </div>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
            <p className="text-2xl font-bold text-emerald-600">GHS {summary.assets.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Liabilities</p>
            <p className="text-2xl font-bold text-red-600">GHS {summary.liabilities.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Equity</p>
            <p className="text-2xl font-bold text-blue-600">GHS {summary.equity.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={formattedAccounts} searchKey="name" />
    </div>
  );
}
