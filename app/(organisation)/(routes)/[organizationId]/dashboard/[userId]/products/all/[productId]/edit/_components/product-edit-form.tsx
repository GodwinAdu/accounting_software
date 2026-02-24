"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getProductById } from "@/lib/actions/product.action";
import { ProductForm } from "../../new/_components/product-form";
import { toast } from "sonner";

export function ProductEditForm() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    const result = await getProductById(params.productId as string);
    if (result.success && result.data) {
      setProduct(result.data);
    } else {
      toast.error("Failed to load product");
      router.back();
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductForm isEdit={true} initialData={product} />;
}
