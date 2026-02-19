"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createSMSCampaign } from "@/lib/actions/sms-campaign.action";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  message: z.string().min(1, "Message is required").max(160, "Message must be 160 characters or less"),
  recipientType: z.enum(["all", "customers", "employees", "custom"]),
  customPhones: z.string().optional(),
});

export default function SMSCampaignForm({
  customers,
  employees,
  organizationId,
  userId,
}: {
  customers: any[];
  employees: any[];
  organizationId: string;
  userId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
      recipientType: "all",
      customPhones: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const recipients: any = { type: values.recipientType };

      if (values.recipientType === "custom" && values.customPhones) {
        recipients.phones = values.customPhones.split(",").map((p) => p.trim());
      } else if (values.recipientType === "customers") {
        recipients.customerIds = customers.map((c) => c._id);
      } else if (values.recipientType === "employees") {
        recipients.employeeIds = employees.map((e) => e._id);
      }

      const result = await createSMSCampaign({
        name: values.name,
        message: values.message,
        recipients,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("SMS campaign created successfully");
        router.push(`/${organizationId}/dashboard/${userId}/marketing/sms`);
      }
    } catch (error) {
      toast.error("Failed to create SMS campaign");
    } finally {
      setLoading(false);
    }
  };

  const recipientType = form.watch("recipientType");
  const message = form.watch("message");

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>New SMS Campaign</CardTitle>
        <CardDescription>Create a new SMS marketing campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Flash Sale Alert" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SMS Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter SMS message (max 160 characters)..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {message.length}/160 characters
                  </FormDescription>
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
                      <SelectItem value="custom">Custom Phone List</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {recipientType === "custom" && (
              <FormField
                control={form.control}
                name="customPhones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Numbers</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter phone numbers separated by commas"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
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
      </CardContent>
    </Card>
  );
}
