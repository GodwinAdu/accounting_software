import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertCircle, Package, ShoppingCart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { QuickOrderDialog } from "./_components/quick-order-dialog";
import { getReorderAlerts } from "@/lib/actions/reorder.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function ReorderAlertsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const result = await getReorderAlerts();
  
  if (result.error) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const { lowStockProducts, outOfStockProducts, criticalProducts, totalAlerts } = result.data!;

  const getStockStatus = (product: any) => {
    if (product.currentStock === 0) return { label: "Out of Stock", variant: "destructive" };
    if (product.currentStock < product.reorderLevel * 0.5) return { label: "Critical", variant: "destructive" };
    if (product.currentStock <= product.reorderLevel) return { label: "Low Stock", variant: "secondary" };
    return { label: "In Stock", variant: "outline" };
  };

  return (
    <div className="space-y-6">
      <Heading title="Reorder Alerts" description="Automatic alerts for low stock items" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">Active alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Urgent action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Reorder soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <ShoppingCart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalProducts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Below 50% threshold</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reorder Recommendations</CardTitle>
          <div className="flex gap-2">
            <Link href={`/${organizationId}/dashboard/${userId}/expenses/purchase-orders/new`}>
              <Button size="sm" variant="outline">
                <ShoppingBag className="h-4 w-4 mr-1" />
                Create PO
              </Button>
            </Link>
            <Link href={`/${organizationId}/dashboard/${userId}/products/inventory`}>
              <Button size="sm" variant="outline">
                <Package className="h-4 w-4 mr-1" />
                Inventory
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {totalAlerts === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-emerald-600 mb-4" />
              <p className="text-muted-foreground">All products are well stocked</p>
              <p className="text-sm text-muted-foreground mt-2">No reorder alerts at this time</p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...outOfStockProducts, ...lowStockProducts].map((product: any) => {
                const status = getStockStatus(product);
                const suggestedOrder = product.reorderQuantity || product.reorderLevel * 2;
                return (
                  <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku} • Current: {product.currentStock} {product.unit} • Reorder Level: {product.reorderLevel}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">Suggested: {suggestedOrder} {product.unit}</p>
                        <p className="text-xs text-muted-foreground">Est. Cost: GHS {(product.costPrice * suggestedOrder).toLocaleString()}</p>
                      </div>
                      <Badge variant={status.variant as any}>{status.label}</Badge>
                      <QuickOrderDialog 
                        product={product} 
                        suggestedQuantity={suggestedOrder} 
                        organizationId={organizationId}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
