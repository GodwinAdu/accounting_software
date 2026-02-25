"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DownloadPayrollButton({ run }: { run: any }) {
  const handleDownload = () => {
    const lines = [
      "PAYROLL RUN REPORT",
      `Run Number: ${run.runNumber}`,
      `Pay Period: ${run.payPeriod}`,
      `Pay Date: ${new Date(run.payDate).toLocaleDateString()}`,
      `Status: ${run.status}`,
      "",
      "SUMMARY",
      `Total Employees: ${run.employeeCount}`,
      `Gross Pay: GHS ${run.totalGrossPay.toLocaleString()}`,
      `Total Deductions: GHS ${run.totalDeductions.toLocaleString()}`,
      `Net Pay: GHS ${run.totalNetPay.toLocaleString()}`,
      "",
      "EMPLOYEE PAYMENTS",
      "Employee,Gross Pay,Deductions,Net Pay",
      ...run.employeePayments.map((p: any) => 
        `${p.employeeId.userId?.fullName || "N/A"},${p.grossPay},${p.totalDeductions},${p.netPay}`
      ),
    ];

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payroll-${run.runNumber}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" onClick={handleDownload}>
      <Download className="mr-2 h-4 w-4" />
      Download Report
    </Button>
  );
}
