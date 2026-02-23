"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Invoice = {
  _id: string;
  invoiceNumber: string;
};

interface InvoiceComboboxProps {
  value: string;
  onChange: (value: string) => void;
  invoices: Invoice[];
}

export function InvoiceCombobox({ value, onChange, invoices }: InvoiceComboboxProps) {
  const [open, setOpen] = useState(false);
  const selectedInvoice = invoices.find((invoice) => invoice._id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedInvoice ? selectedInvoice.invoiceNumber : "Select invoice..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search invoice..." />
          <CommandList>
            <CommandEmpty>No invoice found.</CommandEmpty>
            <CommandGroup>
              {invoices.map((invoice) => (
                <CommandItem
                  key={invoice._id}
                  value={invoice.invoiceNumber}
                  onSelect={() => {
                    onChange(invoice._id);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === invoice._id ? "opacity-100" : "opacity-0")} />
                  {invoice.invoiceNumber}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
