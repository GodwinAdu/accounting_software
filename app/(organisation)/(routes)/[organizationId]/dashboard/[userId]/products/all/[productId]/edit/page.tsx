import { Separator } from "@/components/ui/separator";
import { ProductForm } from "../../new/_components/product-form";
import Heading from "@/components/commons/Header";
import { getProductById } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const result = await getProductById(productId);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Edit Product"
        description="Update product details"
      />
      <Separator />
      <ProductForm initialData={result.data} />
    </div>
  );
}
