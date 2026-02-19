"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileCheck, Clock, AlertCircle } from "lucide-react";
import { RecordVATFilingDialog } from "./record-filing-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface VATFilingHistoryProps {
  filings: any[];
  currentVATPayable: number;
}

export function VATFilingHistory({ filings, currentVATPayable }: VATFilingHistoryProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>;
      case "filed":
        return <Badge className="bg-blue-500">Filed</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <FileCheck className="h-4 w-4 text-green-500" />;
      case "filed":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h3 className="text-lg font-semibold">VAT Filing History</h3>
            <p className="text-sm text-muted-foreground">
              Track your manual VAT filings with GRA
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Filing
          </Button>
        </div>

        {filings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium mb-2">No filings recorded yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Start tracking your VAT filings by recording your first submission
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Record First Filing
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filing #</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Filed Date</TableHead>
                <TableHead className="text-right">Amount (GHS)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>GRA Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filings.map((filing) => (
                <TableRow key={filing._id}>
                  <TableCell className="font-medium">{filing.filingNumber}</TableCell>
                  <TableCell>{filing.filingMonth}</TableCell>
                  <TableCell>
                    {new Date(filing.filedDate).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {filing.vatAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(filing.status)}
                      {getStatusBadge(filing.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {filing.graReferenceNumber || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <RecordVATFilingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentVATPayable={currentVATPayable}
      />
    </>
  );
}
