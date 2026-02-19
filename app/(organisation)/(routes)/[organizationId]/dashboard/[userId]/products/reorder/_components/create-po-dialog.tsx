"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function CreatePurchaseOrderDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <ShoppingCart className="h-4 w-4 mr-1" />
          Create Purchase Orders
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Purchase Orders</DialogTitle>
        </DialogHeader>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Purchase order creation coming soon</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
