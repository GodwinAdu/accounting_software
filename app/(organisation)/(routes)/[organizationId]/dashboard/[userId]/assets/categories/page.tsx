import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Boxes, DollarSign, FolderOpen } from "lucide-react";
import { getAssetCategories } from "@/lib/actions/asset.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function AssetCategoriesPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("assetCategories_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const { categories, summary } = await getAssetCategories();
  const { totalCategories, totalAssets, totalValue } = summary;

  return (
    <div className="space-y-6">
      <Heading title="Asset Categories" description="Organize assets by category" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-xs text-muted-foreground mt-1">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-muted-foreground mt-1">All categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Combined value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Asset Categories</CardTitle>
          <Button size="sm">Add Category</Button>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No categories created</p>
              <p className="text-sm text-muted-foreground mt-2">Create categories to organize your assets</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category: any) => (
                <div key={category._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.categoryCode} • {category.defaultDepreciationMethod.replace("_", " ")} • {category.defaultUsefulLife} years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{category.assetCount} assets</p>
                      <p className="text-xs text-muted-foreground">GHS {category.totalValue.toLocaleString()}</p>
                    </div>
                    <Badge variant="outline">{category.assetCount} items</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
