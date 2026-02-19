"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { format } from "date-fns";

export default function EmployeePayslipsList({ payslips }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payslips</CardTitle>
      </CardHeader>
      <CardContent>
        {payslips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No payslips available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payslips.map((payslip: any) => (
              <div key={payslip._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{payslip.payPeriod}</p>
                    <Badge variant={payslip.status === "completed" ? "default" : "secondary"}>
                      {payslip.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pay Date: {format(new Date(payslip.payDate), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm font-semibold mt-1">
                    Net Pay: GHS {payslip.netPay.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
