"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createEmailCampaign } from "@/lib/actions/email-campaign.action";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  recipientType: z.enum(["all", "customers", "employees", "custom"]),
  customEmails: z.string().optional(),
});

export default function EmailCampaignModal({
  customers,
  employees,
}: {
  customers: any[];
  employees: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subject: "",
      content: "",
      recipientType: "all",
      customEmails: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const recipients: any = { type: values.recipientType };

      if (values.recipientType === "custom" && values.customEmails) {
        recipients.emails = values.customEmails.split(",").map((e) => e.trim());
      } else if (values.recipientType === "customers") {
        recipients.customerIds = customers.map((c) => c._id);
      } else if (values.recipientType === "employees") {
        recipients.employeeIds = employees.map((e) => e._id);
      }

      const result = await createEmailCampaign({
        name: values.name,
        subject: values.subject,
        content: values.content,
        recipients,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Email campaign created successfully");
        setOpen(false);
        form.reset();
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to create email campaign");
    } finally {
      setLoading(false);
    }
  };

  const recipientType = form.watch("recipientType");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Email Campaign</DialogTitle>
          <DialogDescription>Create a new email marketing campaign</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Monthly Newsletter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter email content..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipientType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipients</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Contacts</SelectItem>
                      <SelectItem value="customers">Customers ({customers.length})</SelectItem>
                      <SelectItem value="employees">Employees ({employees.length})</SelectItem>
                      <SelectItem value="custom">Custom Email List</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {recipientType === "custom" && (
              <FormField
                control={form.control}
                name="customEmails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Addresses</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter email addresses separated by commas"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                {loading ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
