"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function NewTransferDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          New Transfer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Stock Transfer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Product</Label>
            <Input placeholder="Select product" />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input type="number" placeholder="100" />
          </div>
          <div>
            <Label>From Warehouse</Label>
            <Input placeholder="Select warehouse" />
          </div>
          <div>
            <Label>To Warehouse</Label>
            <Input placeholder="Select warehouse" />
          </div>
          <div>
            <Label>Notes</Label>
            <Input placeholder="Optional notes" />
          </div>
          <Button className="w-full">Create Transfer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
