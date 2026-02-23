"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { createCustomer } from "@/lib/actions/customer.action";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

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

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().default("Ghana"),
  }).optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface AddCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerAdded: (customer: { _id: string; name: string; company?: string }) => void;
}

export function AddCustomerModal({
  open,
  onOpenChange,
  onCustomerAdded,
}: AddCustomerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        country: "Ghana",
      },
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createCustomer(data, pathname);
      
      if (result.error) {
        toast.error(result.error);
        return;
      }

      const newCustomer = {
        _id: result.data._id,
        name: result.data.name,
        company: result.data.company,
      };

      toast.success("Customer created successfully");
      onCustomerAdded(newCustomer);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Failed to create customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Create a new customer for this receipt
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>

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
                Add Customer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
