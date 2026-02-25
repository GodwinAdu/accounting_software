"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createPayrollRun } from "@/lib/actions/payroll-run.action";
import { toast } from "sonner";

export function PayrollRunClient({ payrollData, totalGross, totalDeductions, totalNet }: any) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentPeriod());
  const [showConfirm, setShowConfirm] = useState(false);

  function getCurrentPeriod() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  const handleRunPayroll = async () => {
    setIsProcessing(true);
    try {
      const [year, month] = selectedPeriod.split("-");
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);

      const result = await createPayrollRun({
        payPeriod: selectedPeriod,
        payDate: endDate,
        startDate,
        endDate,
        employeePayments: payrollData.map((emp: any) => ({
          employeeId: emp.id,
          grossPay: emp.salary,
          deductions: [],
          totalDeductions: emp.deductions,
          netPay: emp.netPay,
        })),
        totalGrossPay: totalGross,
        totalDeductions,
        totalNetPay: totalNet,
        employeeCount: payrollData.length,
        status: "completed",
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Payroll processed successfully");
        setShowConfirm(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to process payroll");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
              const label = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
              return (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowConfirm(true)} disabled={payrollData.length === 0}>
          <Play className="mr-2 h-4 w-4" />
          Run Payroll
        </Button>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payroll Run</DialogTitle>
            <DialogDescription>
              You are about to process payroll for {payrollData.length} employees. This action will create journal entries and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Gross Pay:</span>
              <span className="font-medium">GHS {totalGross.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Deductions:</span>
              <span className="font-medium text-red-600">GHS {totalDeductions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total Net Pay:</span>
              <span className="font-bold text-emerald-600">GHS {totalNet.toLocaleString()}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleRunPayroll} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Confirm & Process"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
