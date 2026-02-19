"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export default function VendorBillsList({ bills }: any) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-orange-100 text-orange-700",
      approved: "bg-blue-100 text-blue-700",
      paid: "bg-green-100 text-green-700",
      overdue: "bg-red-100 text-red-700",
      partial: "bg-yellow-100 text-yellow-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Bills</CardTitle>
      </CardHeader>
      <CardContent>
        {bills.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No bills found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bills.map((bill: any) => (
              <div key={bill._id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{bill.billNumber}</h3>
                      <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Date: {new Date(bill.date).toLocaleDateString()}</p>
                      <p>Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                      <p className="font-semibold text-foreground">
                        Amount: GHS {bill.total.toLocaleString()}
                      </p>
                      {bill.amountPaid > 0 && (
                        <p className="text-emerald-600">
                          Paid: GHS {bill.amountPaid.toLocaleString()}
                        </p>
                      )}
                      {bill.total - bill.amountPaid > 0 && (
                        <p className="text-orange-600 font-semibold">
                          Balance: GHS {(bill.total - bill.amountPaid).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
