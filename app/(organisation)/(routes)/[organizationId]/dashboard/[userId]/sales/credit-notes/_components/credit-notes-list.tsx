"use client";

import { Plus, FileOutput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import CreditNoteDialog from "./credit-note-dialog";
import { deleteCreditNote } from "@/lib/actions/credit-note.action";
import { usePathname } from "next/navigation";

interface CreditNotesListProps {
  creditNotes: any[];
  hasCreatePermission: boolean;
}

export default function CreditNotesList({ creditNotes, hasCreatePermission }: CreditNotesListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const pathname = usePathname();

  const totalAmount = creditNotes.reduce((sum, cn) => sum + cn.total, 0);
  const issuedNotes = creditNotes.filter(cn => cn.status === "issued").length;
  const appliedNotes = creditNotes.filter(cn => cn.status === "applied").length;

  const handleDelete = async (id: string) => {
    if (confirm("Delete this credit note?")) {
      await deleteCreditNote(id, pathname);
      window.location.reload();
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700",
      issued: "bg-blue-100 text-blue-700",
      applied: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

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
            <div className="text-2xl font-bold text-red-600">GHS {totalAmount.toLocaleString()}</div>
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
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { setSelectedNote(null); setDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Credit Note
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {creditNotes.length === 0 ? (
            <div className="text-center py-12">
              <FileOutput className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No credit notes yet</p>
              {hasCreatePermission && (
                <Button onClick={() => setDialogOpen(true)}>Create Your First Credit Note</Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {creditNotes.map((note) => (
                <div key={note._id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{note.creditNoteNumber}</h3>
                        <Badge className={getStatusColor(note.status)}>{note.status}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Customer: {note.customerId?.name || "N/A"}</p>
                        {note.invoiceId && <p>Invoice: {note.invoiceId.invoiceNumber}</p>}
                        <p>Date: {new Date(note.date).toLocaleDateString()}</p>
                        {note.reason && <p>Reason: {note.reason}</p>}
                        <p className="font-semibold text-red-600">Amount: GHS {note.total.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedNote(note); setDialogOpen(true); }}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(note._id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreditNoteDialog open={dialogOpen} onOpenChange={setDialogOpen} creditNote={selectedNote} onSuccess={() => window.location.reload()} />
    </div>
  );
}
