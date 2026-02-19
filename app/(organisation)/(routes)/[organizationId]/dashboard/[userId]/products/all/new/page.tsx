import { redirect } from "next/navigation";
import { currentUser } from "@/lib/helpers/session";
import { checkPermission } from "@/lib/helpers/check-permission";
import { ProductForm } from "./_components/product-form";

export default async function NewProductPage({
  params,
}: {
  params: { organizationId: string; userId: string };
}) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const hasCreatePermission = await checkPermission("products_create");
  if (!hasCreatePermission) {
    redirect(`/${params.organizationId}/dashboard/${params.userId}/products/all`);
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProductForm />
    </div>
  );
}
