import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { getJournalEntryById } from "@/lib/actions/journal-entry.action";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function JournalEntryDetailPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string; entryId: string }>;
}) {
  const { organizationId, userId, entryId } = await params;

  const result = await getJournalEntryById(entryId);
  if (!result.success || !result.data) notFound();

  const entry = result.data;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Link href={`/${organizationId}/dashboard/${userId}/accounting/journal-entries`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">{entry.entryNumber}</h2>
          <p className="text-muted-foreground">{entry.description}</p>
        </div>
        <Badge variant={entry.status === "posted" ? "default" : "secondary"} className={entry.status === "posted" ? "bg-emerald-600" : "bg-yellow-600"}>
          {entry.status}
        </Badge>
      </div>
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Entry Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Entry Number:</span>
              <span className="text-sm font-medium">{entry.entryNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Entry Date:</span>
              <span className="text-sm font-medium">{new Date(entry.entryDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Entry Type:</span>
              <span className="text-sm font-medium capitalize">{entry.entryType}</span>
            </div>
            {entry.referenceType && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Reference:</span>
                <span className="text-sm font-medium">{entry.referenceType} - {entry.referenceNumber}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Debit:</span>
              <span className="text-sm font-semibold text-emerald-600">GHS {entry.totalDebit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Credit:</span>
              <span className="text-sm font-semibold text-red-600">GHS {entry.totalCredit.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm font-medium">Balanced:</span>
              <Badge variant={entry.isBalanced ? "default" : "destructive"}>
                {entry.isBalanced ? "Yes" : "No"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entry.lineItems.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.accountId?.accountName || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{item.accountId?.accountCode}</div>
                    </div>
                  </TableCell>
                  <TableCell>{item.description || "-"}</TableCell>
                  <TableCell className="text-right font-medium text-emerald-600">
                    {item.debit > 0 ? `GHS ${item.debit.toLocaleString()}` : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium text-red-600">
                    {item.credit > 0 ? `GHS ${item.credit.toLocaleString()}` : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {entry.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{entry.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
