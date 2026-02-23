"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createExpenseCategory } from "@/lib/actions/expense-category.action";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryAdded: (category: { id: string; name: string }) => void;
}

export function AddCategoryModal({
  open,
  onOpenChange,
  onCategoryAdded,
}: AddCategoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues, e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    setIsSubmitting(true);
    try {
      const result = await createExpenseCategory({
        name: data.name,
        description: data.description,
      }, window.location.pathname);

      if (result.error) {
        toast.error("Failed to create category", { description: result.error });
        return;
      }
      
      const newCategory = {
        id: result.data._id,
        name: result.data.name,
      };

      toast.success("Category created successfully");
      onCategoryAdded(newCategory);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new expense category
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Office Supplies" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this category..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Category
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
