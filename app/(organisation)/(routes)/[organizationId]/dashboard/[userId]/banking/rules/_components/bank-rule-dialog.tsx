"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileCheck } from "lucide-react";
import { createBankRule, updateBankRule } from "@/lib/actions/bank-rule.action";
import { usePathname } from "next/navigation";

export default function BankRuleDialog({ open, onOpenChange, rule, onSuccess }: any) {
  const [formData, setFormData] = useState({ name: "", condition: "contains", value: "", category: "", action: "categorize", status: "active" });
  const pathname = usePathname();

  useEffect(() => {
    if (rule) setFormData(rule);
    else setFormData({ name: "", condition: "contains", value: "", category: "", action: "categorize", status: "active" });
  }, [rule]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = rule ? await updateBankRule(rule._id, formData, pathname) : await createBankRule(formData, pathname);
    if (result.success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            {rule ? "Edit Bank Rule" : "New Bank Rule"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Rule Name *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Rent Payments" required />
          </div>

          <div>
            <Label>Condition *</Label>
            <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="contains">Description contains</SelectItem>
                <SelectItem value="starts-with">Description starts with</SelectItem>
                <SelectItem value="ends-with">Description ends with</SelectItem>
                <SelectItem value="equals">Description equals</SelectItem>
                <SelectItem value="amount-greater">Amount greater than</SelectItem>
                <SelectItem value="amount-less">Amount less than</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Value *</Label>
            <Input value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} placeholder="e.g., rent" required />
          </div>

          <div>
            <Label>Category</Label>
            <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g., Rent Expense" />
          </div>

          <div>
            <Label>Action *</Label>
            <Select value={formData.action} onValueChange={(value) => setFormData({ ...formData, action: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="categorize">Auto-categorize</SelectItem>
                <SelectItem value="tag">Add tag</SelectItem>
                <SelectItem value="flag">Flag for review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save Rule</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
