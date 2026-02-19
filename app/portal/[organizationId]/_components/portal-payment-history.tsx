"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortalPaymentHistory({ receipts }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {receipts.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No payments yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {receipts.map((receipt: any) => (
              <div key={receipt._id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Receipt className="h-4 w-4 text-emerald-600" />
                      <h3 className="font-semibold">{receipt.receiptNumber}</h3>
                      <Badge className="bg-green-100 text-green-700">Paid</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Date: {new Date(receipt.date).toLocaleDateString()}</p>
                      {receipt.invoiceId && <p>Invoice: {receipt.invoiceId.invoiceNumber}</p>}
                      <p>Payment Method: {receipt.paymentMethod || "N/A"}</p>
                      <p className="font-semibold text-emerald-600">
                        Amount: GHS {receipt.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
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
