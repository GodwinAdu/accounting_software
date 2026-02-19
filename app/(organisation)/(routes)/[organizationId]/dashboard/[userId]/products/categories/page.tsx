import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getProductCategories } from "@/lib/actions/product-category.action";
import { currentUser } from "@/lib/helpers/session";
import { checkPermission } from "@/lib/helpers/check-permission";
import { AddCategoryDialog } from "./_components/add-category-dialog";

export default async function CategoriesPage({
  params,
}: {
  params: { organizationId: string; userId: string };
}) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const hasViewPermission = await checkPermission("productCategories_view");
  if (!hasViewPermission) {
    redirect(`/${params.organizationId}/dashboard/${params.userId}`);
  }

  const hasCreatePermission = await checkPermission("productCategories_create");

  const result = await getProductCategories();
  const categories = result.success ? result.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title={`Product Categories (${categories.length})`}
          description="Organize products into categories"
        />
        {hasCreatePermission && (
          <AddCategoryDialog />
        )}
      </div>
      <Separator />

      <DataTable searchKey="name"  columns={columns} data={categories} />
    </div>
  );
}
