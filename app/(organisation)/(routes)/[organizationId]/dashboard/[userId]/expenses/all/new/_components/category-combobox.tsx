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
import { AddCategoryModal } from "./add-category-modal";

type Category = {
  id: string;
  name: string;
};

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
  categories: Category[];
  onCategoryAdded: (category: Category) => void;
}

export function CategoryCombobox({
  value,
  onChange,
  categories,
  onCategoryAdded,
}: CategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const selectedCategory = categories.find((category) => category.id === value);

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
            {selectedCategory ? selectedCategory.name : "Select category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => {
                      onChange(category.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === category.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {category.name}
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
                Add New Category
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      <AddCategoryModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onCategoryAdded={(category) => {
          onCategoryAdded(category);
          onChange(category.id);
        }}
      />
    </>
  );
}
