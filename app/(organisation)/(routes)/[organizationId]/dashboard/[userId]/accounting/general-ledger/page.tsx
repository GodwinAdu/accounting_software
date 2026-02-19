import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getGeneralLedger } from "@/lib/actions/general-ledger.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { redirect } from "next/navigation";

export default async function GeneralLedgerPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("generalLedger_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const ledgerResult = await getGeneralLedger({});
  const transactions = ledgerResult.data || [];

  const totalDebit = transactions.reduce((sum: number, t: any) => sum + t.debit, 0);
  const totalCredit = transactions.reduce((sum: number, t: any) => sum + t.credit, 0);

  const formattedTransactions = transactions.map((txn: any) => ({
    id: txn._id,
    date: new Date(txn.transactionDate).toLocaleDateString(),
    reference: txn.journalEntryId?.entryNumber || "N/A",
    description: txn.description || txn.journalEntryId?.description || "",
    account: txn.accountId?.accountName || "Unknown",
    debit: txn.debit,
    credit: txn.credit,
    balance: txn.runningBalance,
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="General Ledger"
          description="View all accounting transactions and balances"
        />
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold">{transactions.length}</p>
          </div>
        </div>
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
      </div>

      <DataTable columns={columns} data={formattedTransactions} />
    </div>
  );
}
