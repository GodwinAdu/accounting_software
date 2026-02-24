import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/product.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Package, Layers, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProductDetailPage({
  params,
}: {
  params: { organizationId: string; userId: string; productId: string };
}) {
  const result = await getProductById(params.productId);

  if (result.error || !result.data) {
    notFound();
  }

  const product = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${params.organizationId}/dashboard/${params.userId}/products/all`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.sku}</p>
          </div>
        </div>
        <Badge className={product.status === "active" ? "bg-emerald-600" : "bg-gray-500"}>
          {product.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium capitalize">{product.type}</span>
              
              <span className="text-muted-foreground">Category:</span>
              <span className="font-medium">{product.categoryId?.name || "Uncategorized"}</span>
              
              <span className="text-muted-foreground">Unit:</span>
              <span className="font-medium">{product.unit}</span>
              
              <span className="text-muted-foreground">Barcode:</span>
              <span className="font-medium">{product.barcode || "N/A"}</span>
            </div>
            {product.description && (
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Selling Price:</span>
              <span className="font-medium">GHS {product.sellingPrice.toLocaleString()}</span>
              
              <span className="text-muted-foreground">Cost Price:</span>
              <span className="font-medium">GHS {product.costPrice.toLocaleString()}</span>
              
              <span className="text-muted-foreground">Margin:</span>
              <span className="font-medium text-emerald-600">{product.margin?.toFixed(2)}%</span>
              
              <span className="text-muted-foreground">Current Stock:</span>
              <span className="font-medium">{product.currentStock}</span>
              
              <span className="text-muted-foreground">Reorder Level:</span>
              <span className="font-medium">{product.reorderLevel}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {(product.salesAccountId || product.purchaseAccountId || product.inventoryAccountId) && (
        <Card>
          <CardHeader>
            <CardTitle>Linked GL Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {product.salesAccountId && (
                <div>
                  <p className="text-muted-foreground mb-1">Sales Account</p>
                  <p className="font-medium">{product.salesAccountId}</p>
                </div>
              )}
              {product.purchaseAccountId && (
                <div>
                  <p className="text-muted-foreground mb-1">Purchase Account</p>
                  <p className="font-medium">{product.purchaseAccountId}</p>
                </div>
              )}
              {product.inventoryAccountId && (
                <div>
                  <p className="text-muted-foreground mb-1">Inventory Account</p>
                  <p className="font-medium">{product.inventoryAccountId}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {product.hasVariants && product.variants && product.variants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Product Variants ({product.variants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Attributes</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.variants.map((variant: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{variant.name}</TableCell>
                    <TableCell>{variant.sku}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(variant.attributes || {}).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}: {String(value)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>GHS {variant.costPrice.toLocaleString()}</TableCell>
                    <TableCell>GHS {variant.sellingPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={variant.stock > 0 ? "default" : "destructive"}>
                        {variant.stock}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {product.type === "bundle" && product.bundleItems && product.bundleItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Bundle Items ({product.bundleItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.bundleItems.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.productId}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {product.suppliers && product.suppliers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Suppliers ({product.suppliers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier ID</TableHead>
                  <TableHead>Supplier SKU</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Lead Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.suppliers.map((supplier: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{supplier.supplierId}</TableCell>
                    <TableCell>{supplier.supplierSKU || "N/A"}</TableCell>
                    <TableCell>GHS {supplier.costPrice.toLocaleString()}</TableCell>
                    <TableCell>{supplier.leadTime ? `${supplier.leadTime} days` : "N/A"}</TableCell>
                    <TableCell>
                      {supplier.isPreferred && (
                        <Badge className="bg-emerald-600">Preferred</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
