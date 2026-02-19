"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AddVendorModal } from "./add-vendor-modal";

type Vendor = {
  id: string;
  name: string;
};

interface VendorComboboxProps {
  value: string;
  onChange: (value: string) => void;
  vendors: Vendor[];
  onVendorAdded: (vendor: Vendor) => void;
}

export function VendorCombobox({
  value,
  onChange,
  vendors,
  onVendorAdded,
}: VendorComboboxProps) {
  const [open, setOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const selectedVendor = vendors.find((vendor) => vendor.id === value);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedVendor ? selectedVendor.name : "Select vendor..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search vendor..." />
            <CommandList>
              <CommandEmpty>No vendor found.</CommandEmpty>
              <CommandGroup>
                {vendors.map((vendor) => (
                  <CommandItem
                    key={vendor.id}
                    value={vendor.name}
                    onSelect={() => {
                      onChange(vendor.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === vendor.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {vendor.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <div className="border-t p-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                onClick={() => {
                  setOpen(false);
                  setShowAddModal(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Vendor
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <AddVendorModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onVendorAdded={(vendor) => {
          onVendorAdded(vendor);
          onChange(vendor.id);
        }}
      />
    </>
  );
}
