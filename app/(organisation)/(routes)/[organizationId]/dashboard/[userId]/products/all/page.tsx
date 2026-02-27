import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getProducts, getInventorySummary } from "@/lib/actions/product.action";
import { currentUser } from "@/lib/helpers/session";
import { checkPermission } from "@/lib/helpers/check-permission";
import Link from "next/link";
import { ProductsTable } from "./_components/products-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Package } from "lucide-react";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("products_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("products_create");

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
          title={`Products (${products.length})`}
          description="Manage your product catalog and inventory"
        />
        {hasCreatePermission && (
          <Link href={`/${organizationId}/dashboard/${userId}/products/all/new`}>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        )}
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Products</p>
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
            <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
            <p className="text-2xl font-bold text-amber-600">{summary.lowStock}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">{summary.outOfStock}</p>
          </div>
        </div>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Package className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900 font-semibold">Product & Inventory Management</AlertTitle>
        <AlertDescription className="text-blue-800 mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><span className="font-semibold">Inventory tracking:</span> Enable for physical products, disable for services</li>
            <li><span className="font-semibold">Cost vs Selling Price:</span> Cost is what you pay, selling price is what customers pay</li>
            <li><span className="font-semibold">Tax settings:</span> Set tax rates per product for accurate invoicing</li>
            <li><span className="font-semibold">Reorder levels:</span> Get alerts when stock falls below minimum quantity</li>
          </ul>
        </AlertDescription>
      </Alert>

      <ProductsTable products={products} />
    </div>
  );
}
