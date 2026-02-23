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
import { AddCustomerModal } from "./add-customer-modal";

type Customer = {
  _id: string;
  name: string;
  company?: string;
};

interface CustomerComboboxProps {
  value: string;
  onChange: (value: string) => void;
  customers: Customer[];
  onCustomerAdded: (customer: Customer) => void;
}

export function CustomerCombobox({
  value,
  onChange,
  customers,
  onCustomerAdded,
}: CustomerComboboxProps) {
  const [open, setOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const selectedCustomer = customers.find((customer) => customer._id === value);

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
            {selectedCustomer ? (
              <span className="truncate">
                {selectedCustomer.name}{selectedCustomer.company ? ` - ${selectedCustomer.company}` : ""}
              </span>
            ) : (
              "Select customer..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search customer..." />
            <CommandList>
              <CommandEmpty>No customer found.</CommandEmpty>
              <CommandGroup>
                {customers.map((customer) => (
                  <CommandItem
                    key={customer._id}
                    value={`${customer.name} ${customer.company || ""}`}
                    onSelect={() => {
                      onChange(customer._id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === customer._id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.name}</span>
                      {customer.company && (
                        <span className="text-xs text-muted-foreground">
                          {customer.company}
                        </span>
                      )}
                    </div>
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
                Add New Customer
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <AddCustomerModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onCustomerAdded={(customer) => {
          onCustomerAdded(customer);
          onChange(customer._id);
        }}
      />
    </>
  );
}
