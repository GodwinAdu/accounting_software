"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createVendor } from "@/lib/actions/vendor.action";

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

const vendorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
});

type VendorFormValues = z.infer<typeof vendorSchema>;

interface AddVendorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVendorAdded: (vendor: { id: string; name: string }) => void;
}

export function AddVendorModal({
  open,
  onOpenChange,
  onVendorAdded,
}: AddVendorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: VendorFormValues, e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    setIsSubmitting(true);
    try {
      const result = await createVendor({
        companyName: data.company,
        contactName: data.name,
        email: data.email,
        phone: data.phone,
      }, window.location.pathname);

      if (result.error) {
        toast.error("Failed to create vendor", { description: result.error });
        return;
      }
      
      const newVendor = {
        id: result.data._id,
        name: result.data.companyName,
      };

      toast.success("Vendor created successfully");
      onVendorAdded(newVendor);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating vendor:", error);
      toast.error("Failed to create vendor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
          <DialogDescription>
            Create a new vendor for your expenses
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
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <Input placeholder="+233 24 123 4567" {...field} />
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
                Add Vendor
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
