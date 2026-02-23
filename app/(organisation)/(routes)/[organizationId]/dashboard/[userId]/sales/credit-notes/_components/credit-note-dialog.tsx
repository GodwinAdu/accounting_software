"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createCreditNote, updateCreditNote } from "@/lib/actions/credit-note.action";
import { usePathname } from "next/navigation";
import { AccountSelector } from "@/components/forms/account-selector";

export default function CreditNoteDialog({ open, onOpenChange, creditNote, onSuccess }: any) {
  const [formData, setFormData] = useState({ customerId: "", invoiceId: "", date: new Date().toISOString().split('T')[0], reason: "", total: 0, status: "draft", notes: "", revenueAccountId: "", receivableAccountId: "" });
  const pathname = usePathname();

  useEffect(() => {
    if (creditNote) setFormData(creditNote);
    else setFormData({ customerId: "", invoiceId: "", date: new Date().toISOString().split('T')[0], reason: "", total: 0, status: "draft", notes: "", revenueAccountId: "", receivableAccountId: "" });
  }, [creditNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = creditNote ? await updateCreditNote(creditNote._id, formData, pathname) : await createCreditNote(formData, pathname);
    if (result.success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{creditNote ? "Edit Credit Note" : "New Credit Note"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Customer ID *</Label>
            <Input value={formData.customerId} onChange={(e) => setFormData({ ...formData, customerId: e.target.value })} required />
          </div>

          <div>
            <Label>Invoice ID (Optional)</Label>
            <Input value={formData.invoiceId} onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })} />
          </div>

          <div>
            <Label>Date *</Label>
            <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          </div>

          <div>
            <Label>Reason</Label>
            <Input value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="e.g., Product return" />
          </div>

          <div>
            <Label>Amount *</Label>
            <Input type="number" step="0.01" value={formData.total} onChange={(e) => setFormData({ ...formData, total: Number(e.target.value) })} required />
          </div>

          <div>
            <Label>Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <div>
            <Label>Revenue Account (Optional)</Label>
            <AccountSelector label="" accountType="revenue" value={formData.revenueAccountId} onChange={(value) => setFormData({ ...formData, revenueAccountId: value })} placeholder="Default: Sales Revenue" />
          </div>

          <div>
            <Label>Accounts Receivable (Optional)</Label>
            <AccountSelector label="" accountType="asset" value={formData.receivableAccountId} onChange={(value) => setFormData({ ...formData, receivableAccountId: value })} placeholder="Default: Accounts Receivable" />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
