"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { LoanRequestDialog } from "./loan-request-dialog";

export default function EmployeeLoans({ loans, employeeId }: any) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
        return { label: status === "active" ? "Active" : "Approved", className: "bg-emerald-100 text-emerald-700" };
      case "pending":
        return { label: "Pending", className: "bg-yellow-100 text-yellow-700" };
      case "rejected":
        return { label: "Rejected", className: "bg-red-100 text-red-700" };
      case "completed":
        return { label: "Completed", className: "bg-gray-100 text-gray-700" };
      default:
        return { label: status, className: "bg-gray-100 text-gray-700" };
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Loan Requests</CardTitle>
        <LoanRequestDialog employeeId={employeeId} />
      </CardHeader>
      <CardContent>
        {loans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No loan requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {loans.map((loan: any) => {
              const config = getStatusConfig(loan.status);
              return (
                <div key={loan._id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium">GHS {loan.amount.toLocaleString()}</p>
                        <Badge className={config.className}>{config.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {loan.repaymentMonths} months • GHS {loan.monthlyDeduction.toFixed(2)}/month
                      </p>
                      {loan.status === "active" && (
                        <p className="text-sm text-muted-foreground">
                          Outstanding: GHS {loan.outstandingBalance.toLocaleString()} • Repaid: GHS {loan.totalRepaid.toLocaleString()}
                        </p>
                      )}
                      <p className="text-sm mt-1">{loan.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested on {format(new Date(loan.createdAt), "MMM dd, yyyy")}
                      </p>
                      {loan.rejectionReason && (
                        <p className="text-sm text-red-600 mt-1">Reason: {loan.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
