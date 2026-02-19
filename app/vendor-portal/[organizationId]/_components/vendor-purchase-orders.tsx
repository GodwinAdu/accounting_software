"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

export default function VendorPurchaseOrders({ purchaseOrders }: any) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-orange-100 text-orange-700",
      approved: "bg-blue-100 text-blue-700",
      received: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {purchaseOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No purchase orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {purchaseOrders.map((po: any) => (
              <div key={po._id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{po.poNumber}</h3>
                      <Badge className={getStatusColor(po.status)}>{po.status}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Date: {new Date(po.date).toLocaleDateString()}</p>
                      {po.expectedDelivery && (
                        <p>Expected Delivery: {new Date(po.expectedDelivery).toLocaleDateString()}</p>
                      )}
                      <p className="font-semibold text-foreground">
                        Amount: GHS {po.total.toLocaleString()}
                      </p>
                      {po.notes && <p className="text-xs">Notes: {po.notes}</p>}
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
