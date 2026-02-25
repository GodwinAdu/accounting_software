"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from "lucide-react";
import { createEmployeeLoan } from "@/lib/actions/employee-loan.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoanRequestDialog({ employeeId }: { employeeId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState("");
  const [reason, setReason] = useState("");

  const monthlyDeduction = amount && repaymentMonths ? (parseFloat(amount) / parseInt(repaymentMonths)).toFixed(2) : "0";

  const handleSubmit = async () => {
    if (!amount || !repaymentMonths || !reason) {
      toast.error("Please fill all required fields");
      return;
    }

    const amountNum = parseFloat(amount);
    const monthsNum = parseInt(repaymentMonths);

    if (amountNum <= 0 || monthsNum <= 0) {
      toast.error("Amount and repayment months must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      const result = await createEmployeeLoan({
        employeeId,
        amount: amountNum,
        repaymentMonths: monthsNum,
        reason,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Loan request submitted successfully");
        setOpen(false);
        setAmount("");
        setRepaymentMonths("");
        setReason("");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to submit loan request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <DollarSign className="h-4 w-4 mr-1" />
          Request Loan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Loan</DialogTitle>
          <DialogDescription>Submit a loan request for approval</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Loan Amount (GHS) *</Label>
            <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="0.01" />
          </div>

          <div className="space-y-2">
            <Label>Repayment Period (Months) *</Label>
            <Input type="number" placeholder="12" value={repaymentMonths} onChange={(e) => setRepaymentMonths(e.target.value)} min="1" />
          </div>

          {monthlyDeduction !== "0" && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-muted-foreground">Monthly Deduction</p>
              <p className="text-lg font-bold text-emerald-600">GHS {monthlyDeduction}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Reason *</Label>
            <Textarea placeholder="Provide a reason for your loan request" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
