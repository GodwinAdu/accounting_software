import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getJournalEntries } from "@/lib/actions/journal-entry.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function JournalEntriesPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("journalEntries_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const hasCreatePermission = await checkPermission("journalEntries_create");

  const entriesResult = await getJournalEntries();
  const entries = entriesResult.data || [];

  const posted = entries.filter((e: any) => e.status === "posted").length;
  const draft = entries.filter((e: any) => e.status === "draft").length;

  const formattedEntries = entries.map((entry: any) => ({
    id: entry._id,
    reference: entry.entryNumber,
    date: new Date(entry.entryDate).toLocaleDateString(),
    description: entry.description,
    totalDebit: entry.totalDebit,
    totalCredit: entry.totalCredit,
    status: entry.status,
    createdBy: entry.createdBy?.fullName || "System",
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`Journal Entries (${entries.length})`}
          description="Record and manage accounting journal entries"
        />
        {hasCreatePermission && (
          <Link href={`/${organizationId}/dashboard/${userId}/accounting/journal-entries/new`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        )}
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
            <p className="text-2xl font-bold">{entries.length}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Posted</p>
            <p className="text-2xl font-bold text-emerald-600">{posted}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Draft</p>
            <p className="text-2xl font-bold text-yellow-600">{draft}</p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={formattedEntries} />
    </div>
  );
}
