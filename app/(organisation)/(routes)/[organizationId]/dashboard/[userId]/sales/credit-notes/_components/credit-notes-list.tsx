"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";

interface CreditNotesListProps {
  creditNotes: any[];
  hasCreatePermission: boolean;
}

export default function CreditNotesList({ creditNotes, hasCreatePermission }: CreditNotesListProps) {
  const router = useRouter();
  const params = useParams();

  const totalAmount = creditNotes.reduce((sum, cn) => sum + cn.total, 0);
  const issuedNotes = creditNotes.filter(cn => cn.status === "issued").length;
  const appliedNotes = creditNotes.filter(cn => cn.status === "applied").length;

  const formattedData = creditNotes.map(cn => ({
    _id: cn._id,
    creditNoteNumber: cn.creditNoteNumber,
    date: new Date(cn.date).toLocaleDateString(),
    customer: cn.customerId?.name || "N/A",
    reason: cn.reason,
    total: cn.total,
    status: cn.status,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credit Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditNotes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{issuedNotes} issued</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">-GHS {totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Credit issued</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{appliedNotes}</div>
            <p className="text-xs text-muted-foreground mt-1">To invoices</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Credit Notes</CardTitle>
            {hasCreatePermission && (
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700" 
                onClick={() => router.push(`/${params.organizationId}/dashboard/${params.userId}/sales/credit-notes/new`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Credit Note
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={formattedData} searchKey="creditNoteNumber" />
        </CardContent>
      </Card>
    </div>
  );
}
