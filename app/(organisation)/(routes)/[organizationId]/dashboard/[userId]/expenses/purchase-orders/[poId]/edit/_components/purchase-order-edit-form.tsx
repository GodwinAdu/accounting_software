"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PurchaseOrderForm } from "../../new/_components/purchase-order-form";
import { getPurchaseOrderById, updatePurchaseOrder } from "@/lib/actions/purchase-order.action";
import { toast } from "sonner";

export function PurchaseOrderEditForm() {
  const router = useRouter();
  const params = useParams();
  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPO();
  }, []);

  const loadPO = async () => {
    const result = await getPurchaseOrderById(params.poId as string);
    if (result.success && result.data) {
      setPo(result.data);
    } else {
      toast.error("Failed to load purchase order");
      router.back();
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!po) {
    return <div>Purchase order not found</div>;
  }

  return <div>Edit form - Use create form with pre-filled data</div>;
}
