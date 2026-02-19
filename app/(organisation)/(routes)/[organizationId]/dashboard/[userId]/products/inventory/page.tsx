import { Download, AlertTriangle } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getProducts, getInventorySummary } from "@/lib/actions/product.action";
import { currentUser } from "@/lib/helpers/session";
import { checkPermission } from "@/lib/helpers/check-permission";

export default async function InventoryPage({
  params,
}: {
  params: { organizationId: string; userId: string };
}) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const hasViewPermission = await checkPermission("inventory_view");
  if (!hasViewPermission) {
    redirect(`/${params.organizationId}/dashboard/${params.userId}`);
  }

  const [productsResult, summaryResult] = await Promise.all([
    getProducts(),
    getInventorySummary(),
  ]);

  const products = productsResult.success ? productsResult.data : [];
  const summary = summaryResult.success ? summaryResult.data : {
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Inventory Tracking"
          description="Monitor stock levels and inventory value"
        />
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold">{summary.totalProducts}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
            <p className="text-2xl font-bold text-emerald-600">
              GHS {summary.totalValue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600">{summary.lowStock}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">{summary.outOfStock}</p>
          </div>
        </div>
      </div>

      {(summary.lowStock > 0 || summary.outOfStock > 0) && (
        <div className="rounded-lg border bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900">Stock Alerts</h4>
              <p className="text-sm text-yellow-700 mt-1">
                {summary.lowStock > 0 && `${summary.lowStock} item(s) running low on stock. `}
                {summary.outOfStock > 0 && `${summary.outOfStock} item(s) out of stock.`}
              </p>
            </div>
          </div>
        </div>
      )}

      <DataTable searchKey="" columns={columns} data={products} />
    </div>
  );
}
