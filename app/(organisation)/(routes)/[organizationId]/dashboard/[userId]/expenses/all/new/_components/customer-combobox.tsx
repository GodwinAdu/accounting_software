"use client";

import * as React from "react";
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
import { getCustomers } from "@/lib/actions/customer.action";

interface CustomerComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
  customers: Array<{ id: string; name: string; email: string }>;
  onCustomerAdded?: (customer: { id: string; name: string; email: string }) => void;
}

export function CustomerCombobox({ value, onValueChange, customers, onCustomerAdded }: CustomerComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [customerList, setCustomerList] = React.useState(customers);

  React.useEffect(() => {
    setCustomerList(customers);
  }, [customers]);

  const selectedCustomer = customerList.find((customer) => customer.id === value);

  const handleAddCustomer = (customer: { id: string; name: string; email: string }) => {
    setCustomerList([...customerList, customer]);
    onValueChange(customer.id);
    onCustomerAdded?.(customer);
  };

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
            {selectedCustomer ? selectedCustomer.name : "Select customer..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search customer..." />
            <CommandList>
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 py-4">
                  <p className="text-sm text-muted-foreground">No customer found.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOpen(false);
                      setShowAddModal(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Customer
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {customerList.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={customer.name}
                    onSelect={() => {
                      onValueChange(customer.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === customer.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{customer.name}</span>
                      <span className="text-xs text-muted-foreground">{customer.email}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                setOpen(false);
                setShowAddModal(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <AddCustomerModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onCustomerAdded={handleAddCustomer}
      />
    </>
  );
}
