"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPurchaseOrder } from "@/lib/actions/purchase-order.action";
import { toast } from "sonner";

interface QuickOrderDialogProps {
  product: any;
  suggestedQuantity: number;
  organizationId: string;
}

export function QuickOrderDialog({ product, suggestedQuantity, organizationId }: QuickOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(suggestedQuantity);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const poData = {
        items: [{
          type: "product",
          productId: product.productId || product._id,
          variantSku: product.variantSku,
          description: product.name,
          quantity,
          unitPrice: product.costPrice,
          amount: quantity * product.costPrice,
        }],
        subtotal: quantity * product.costPrice,
        taxAmount: 0,
        total: quantity * product.costPrice,
        status: "draft",
      };

      const result = await createPurchaseOrder(poData, pathname);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Purchase order created successfully");
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to create purchase order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        Order
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Order - {product.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <Input value={product.name} disabled />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Unit Price</Label>
                <Input value={`GHS ${product.costPrice}`} disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <Input value={`GHS ${(quantity * product.costPrice).toLocaleString()}`} disabled />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleSubmit}
              disabled={isSubmitting || quantity < 1}
            >
              {isSubmitting ? "Creating..." : "Create PO"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
