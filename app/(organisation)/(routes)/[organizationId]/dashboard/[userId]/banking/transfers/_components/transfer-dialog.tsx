"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftRight } from "lucide-react";

export default function TransferDialog({ open, onOpenChange, accounts }: any) {
  const [formData, setFormData] = useState({ fromAccount: "", toAccount: "", amount: 0, date: new Date().toISOString().split('T')[0], notes: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement transfer creation
    console.log("Transfer:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            New Transfer
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>From Account *</Label>
            <Select value={formData.fromAccount} onValueChange={(value) => setFormData({ ...formData, fromAccount: value })}>
              <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
              <SelectContent>
                {accounts.map((acc: any) => (
                  <SelectItem key={acc._id} value={acc._id}>
                    {acc.accountName} - GHS {acc.currentBalance.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>To Account *</Label>
            <Select value={formData.toAccount} onValueChange={(value) => setFormData({ ...formData, toAccount: value })}>
              <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
              <SelectContent>
                {accounts.filter((a: any) => a._id !== formData.fromAccount).map((acc: any) => (
                  <SelectItem key={acc._id} value={acc._id}>
                    {acc.accountName} - GHS {acc.currentBalance.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Amount *</Label>
            <Input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} required />
          </div>

          <div>
            <Label>Transfer Date *</Label>
            <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Optional transfer notes" />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Create Transfer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
