"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function AddWarehouseDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Warehouse
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Warehouse</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Warehouse Name</Label>
            <Input placeholder="Main Warehouse" />
          </div>
          <div>
            <Label>Location</Label>
            <Input placeholder="Accra, Ghana" />
          </div>
          <div>
            <Label>Address</Label>
            <Input placeholder="123 Industrial Area" />
          </div>
          <div>
            <Label>Capacity</Label>
            <Input type="number" placeholder="10000" />
          </div>
          <Button className="w-full">Add Warehouse</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
