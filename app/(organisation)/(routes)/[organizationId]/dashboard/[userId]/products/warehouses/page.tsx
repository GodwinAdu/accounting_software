import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Warehouse, Package, MapPin, TrendingUp } from "lucide-react";
import { connectToDB } from "@/lib/connection/mongoose";
import WarehouseModel from "@/lib/models/warehouse.model";
import Product from "@/lib/models/product.model";
import AddWarehouseDialog from "./_components/add-warehouse-dialog";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function WarehousesPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("warehouses_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  await connectToDB();
  
  const warehouses = await WarehouseModel.find({ 
    organizationId, 
    del_flag: false 
  }).populate("managerId", "fullName").lean();

  const products = await Product.find({ organizationId, del_flag: false }).lean();
  
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalStock = products.reduce((sum, p) => sum + p.currentStock, 0);
  const utilizationRate = totalCapacity > 0 ? ((totalStock / totalCapacity) * 100).toFixed(1) : "0.0";

  const getUtilizationColor = (current: number, capacity: number) => {
    const rate = (current / capacity) * 100;
    if (rate >= 90) return "text-red-600";
    if (rate >= 75) return "text-orange-600";
    return "text-emerald-600";
  };

  return (
    <div className="space-y-6">
      <Heading title="Warehouses" description="Manage multiple warehouse locations" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Units stored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Overall capacity</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Warehouse Locations</CardTitle>
          <AddWarehouseDialog />
        </CardHeader>
        <CardContent>
          {warehouses.length === 0 ? (
            <div className="text-center py-12">
              <Warehouse className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No warehouses configured</p>
              <p className="text-sm text-muted-foreground mt-2">Add your first warehouse location</p>
            </div>
          ) : (
            <div className="space-y-3">
              {warehouses.map((warehouse: any) => {
                const warehouseStock = totalStock / warehouses.length;
                const utilization = ((warehouseStock / warehouse.capacity) * 100).toFixed(1);
                return (
                  <div key={warehouse._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Warehouse className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{warehouse.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {warehouse.location} • {warehouse.address?.city || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Manager: {warehouse.managerId?.fullName || "Unassigned"} • {products.length} products
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{Math.round(warehouseStock).toLocaleString()} / {warehouse.capacity.toLocaleString()}</p>
                        <p className={`text-xs font-semibold ${getUtilizationColor(warehouseStock, warehouse.capacity)}`}>
                          {utilization}% utilized
                        </p>
                      </div>
                      <Badge variant="default">{warehouse.status}</Badge>
                      <Button size="sm" variant="outline">View</Button>
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
