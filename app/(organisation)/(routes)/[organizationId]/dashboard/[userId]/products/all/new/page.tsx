import { redirect } from "next/navigation";
import { currentUser } from "@/lib/helpers/session";
import { checkPermission } from "@/lib/helpers/check-permission";
import { ProductForm } from "./_components/product-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";

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
      <Alert className="border-purple-200 bg-purple-50">
        <Lightbulb className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-800">
          <span className="font-semibold">Quick Tip:</span> For services, disable inventory tracking. For physical products, enable tracking and set reorder levels to avoid stockouts.
        </AlertDescription>
      </Alert>
      
      <ProductForm />
    </div>
  );
}
