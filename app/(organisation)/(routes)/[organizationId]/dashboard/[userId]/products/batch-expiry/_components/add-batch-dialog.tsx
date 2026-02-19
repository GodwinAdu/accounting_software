"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function AddBatchDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Batch
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Batch</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Product</Label>
            <Input placeholder="Select product" />
          </div>
          <div>
            <Label>Batch Number</Label>
            <Input placeholder="BATCH-001" />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input type="number" placeholder="100" />
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Input type="date" />
          </div>
          <Button className="w-full">Add Batch</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
