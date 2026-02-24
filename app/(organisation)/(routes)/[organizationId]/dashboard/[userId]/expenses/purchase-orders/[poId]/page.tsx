import { getPurchaseOrderById } from "@/lib/actions/purchase-order.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Package, Receipt } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function PurchaseOrderDetailPage({ params }: any) {
  const { poId, organizationId, userId } = params;
  const result = await getPurchaseOrderById(poId);

  if (result.error || !result.data) {
    return <div>Purchase order not found</div>;
  }

  const po = result.data;

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    confirmed: "bg-yellow-100 text-yellow-800",
    received: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${organizationId}/dashboard/${userId}/expenses/purchase-orders`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{po.poNumber}</h1>
            <p className="text-sm text-muted-foreground">Purchase Order Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[po.status]}>{po.status.toUpperCase()}</Badge>
          {po.status === "draft" && (
            <Link href={`/${organizationId}/dashboard/${userId}/expenses/purchase-orders/${poId}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">PO Number</p>
                  <p className="font-medium">{po.poNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-medium">{po.vendorId?.companyName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{format(new Date(po.orderDate), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Delivery</p>
                  <p className="font-medium">{po.expectedDate ? format(new Date(po.expectedDate), "PPP") : "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {po.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-start p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={item.type === "product" ? "default" : "secondary"}>
                          {item.type === "product" ? <Package className="h-3 w-3 mr-1" /> : <Receipt className="h-3 w-3 mr-1" />}
                          {item.type === "product" ? "Product" : "Expense"}
                        </Badge>
                      </div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × GHS {item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">GHS {item.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {po.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{po.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">GHS {po.subtotal.toFixed(2)}</span>
                </div>

                {po.taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">GHS {po.taxAmount.toFixed(2)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-emerald-600">GHS {po.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
