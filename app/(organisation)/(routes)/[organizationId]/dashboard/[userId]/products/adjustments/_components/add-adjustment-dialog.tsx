"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createStockAdjustment } from "@/lib/actions/stock-adjustment.action";
import { getProducts } from "@/lib/actions/product.action";
import { toast } from "sonner";

export function AddAdjustmentDialog({ organizationId }: { organizationId: string }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [productId, setProductId] = useState("");
  const [variantSku, setVariantSku] = useState("");
  const [type, setType] = useState<"increase" | "decrease">("increase");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const pathname = usePathname();

  const selectedProduct = products.find(p => p._id === productId);
  const hasVariants = selectedProduct?.hasVariants && selectedProduct?.variants?.length > 0;

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProducts(organizationId);
      if (result.success) {
        setProducts(result.data.filter((p: any) => p.trackInventory));
      }
    };
    if (open) fetchProducts();
  }, [organizationId, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await createStockAdjustment(
      {
        productId,
        variantSku: variantSku || undefined,
        type,
        quantity: parseInt(quantity),
        reason,
      },
      organizationId,
      pathname
    );

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Stock adjustment created successfully");
      setOpen(false);
      setProductId("");
      setVariantSku("");
      setType("increase");
      setQuantity("");
      setReason("");
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          New Adjustment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Stock Adjustment</DialogTitle>
          <DialogDescription>Adjust product inventory levels</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Product *</Label>
            <Select value={productId} onValueChange={(v) => { setProductId(v); setVariantSku(""); }} required>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name} (Stock: {product.currentStock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {hasVariants && (
            <div className="space-y-2">
              <Label>Variant *</Label>
              <Select value={variantSku} onValueChange={setVariantSku} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {selectedProduct.variants.map((variant: any) => (
                    <SelectItem key={variant.sku} value={variant.sku}>
                      {variant.name} (Stock: {variant.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase">Increase</SelectItem>
                  <SelectItem value="decrease">Decrease</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                required
                min="1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Reason *</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for adjustment..."
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Adjustment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
