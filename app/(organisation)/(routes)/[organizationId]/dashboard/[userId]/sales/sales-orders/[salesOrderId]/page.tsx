import { getSalesOrderById } from "@/lib/actions/sales-order.action";
import { getCustomerById } from "@/lib/actions/customer.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Package } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function SalesOrderDetailPage({ params }: any) {
  const { salesOrderId, organizationId, userId } = params;
  const result = await getSalesOrderById(salesOrderId);

  if (result.error || !result.data) {
    return <div>Sales order not found</div>;
  }

  const order = result.data;
  const customerResult = await getCustomerById(order.customerId);
  const customer = customerResult.data;

  const statusColors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-800",
    confirmed: "bg-blue-100 text-blue-800",
    delivered: "bg-emerald-100 text-emerald-800",
    paid: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${organizationId}/dashboard/${userId}/sales/sales-orders`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">Sales Order Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[order.status]}>{order.status.toUpperCase()}</Badge>
          <Link href={`/${organizationId}/dashboard/${userId}/sales/sales-orders/${salesOrderId}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
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
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{format(new Date(order.orderDate), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{customer?.name || "N/A"}</p>
                  {customer?.company && <p className="text-sm text-muted-foreground">{customer.company}</p>}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusColors[order.status]}>{order.status.toUpperCase()}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-start p-4 border rounded-lg">
                    <div className="flex-1">
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

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.notes}</p>
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
                  <span className="font-medium">GHS {order.subtotal.toFixed(2)}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-emerald-600">-GHS {order.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">GHS {order.taxAmount.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-emerald-600">GHS {order.total.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-medium">GHS {order.amountPaid.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Balance Due</span>
                  <span className="text-red-600">GHS {order.balance.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
