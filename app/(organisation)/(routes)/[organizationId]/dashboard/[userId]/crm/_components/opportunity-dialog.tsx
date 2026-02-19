"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createOpportunity, updateOpportunity } from "@/lib/actions/opportunity.action";
import { usePathname } from "next/navigation";

export default function OpportunityDialog({ open, onOpenChange, opportunity, onSuccess }: any) {
  const [formData, setFormData] = useState({ name: "", value: 0, stage: "prospecting", probability: 0, expectedCloseDate: "", notes: "" });
  const pathname = usePathname();

  useEffect(() => {
    if (opportunity) setFormData(opportunity);
    else setFormData({ name: "", value: 0, stage: "prospecting", probability: 0, expectedCloseDate: "", notes: "" });
  }, [opportunity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = opportunity ? await updateOpportunity(opportunity._id, formData, pathname) : await createOpportunity(formData, pathname);
    if (result.success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{opportunity ? "Edit Opportunity" : "New Opportunity"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div>
              <Label>Value *</Label>
              <Input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })} required />
            </div>
            <div>
              <Label>Stage</Label>
              <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospecting">Prospecting</SelectItem>
                  <SelectItem value="qualification">Qualification</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed-won">Closed Won</SelectItem>
                  <SelectItem value="closed-lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Probability (%)</Label>
              <Input type="number" min="0" max="100" value={formData.probability} onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Expected Close Date</Label>
              <Input type="date" value={formData.expectedCloseDate} onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
