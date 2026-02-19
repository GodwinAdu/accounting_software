import { Separator } from "@/components/ui/separator";
import { PurchaseOrderForm } from "./_components/purchase-order-form";
import Heading from "@/components/commons/Header";

export default function NewPurchaseOrderPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="New Purchase Order"
        description="Create a new purchase order"
      />
      <Separator />
      <PurchaseOrderForm />
    </div>
  );
}
