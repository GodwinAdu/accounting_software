"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { approveEmployeeLoan, rejectEmployeeLoan } from "@/lib/actions/employee-loan.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoanActions({ loan }: { loan: any }) {
  const router = useRouter();

  if (loan.status !== "pending") return null;

  const handleApprove = async () => {
    const result = await approveEmployeeLoan(loan._id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Loan approved");
      router.refresh();
    }
  };

  const handleReject = async () => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;
    
    const result = await rejectEmployeeLoan(loan._id, reason);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Loan rejected");
      router.refresh();
    }
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" className="h-8" onClick={handleApprove}>
        <Check className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="outline" className="h-8" onClick={handleReject}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
