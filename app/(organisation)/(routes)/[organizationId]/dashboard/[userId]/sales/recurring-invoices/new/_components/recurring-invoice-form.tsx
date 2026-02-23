"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, CalendarIcon, Plus, Trash2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getCustomers } from "@/lib/actions/customer.action";
import { createRecurringInvoice } from "@/lib/actions/recurring-invoice.action";
import { toast } from "sonner";
import { CustomerCombobox } from "./customer-combobox";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { AccountSelector } from "@/components/forms/account-selector";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description required"),
  quantity: z.number().min(0.01, "Quantity must be positive"),
  rate: z.number().min(0, "Rate must be positive"),
  amount: z.number(),
});

const recurringInvoiceSchema = z.object({
  profileName: z.string().min(1, "Profile name is required"),
  customerId: z.string().min(1, "Customer is required"),
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]),
  startDate: z.date(),
  endDate: z.date().optional(),
  neverExpires: z.boolean().default(false),
  paymentTerms: z.string(),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item required"),
  notes: z.string().optional(),
  terms: z.string().optional(),
  autoSend: z.boolean().default(true),
  revenueAccountId: z.string().optional(),
  receivableAccountId: z.string().optional(),
  taxAccountId: z.string().optional(),
});

type RecurringInvoiceFormValues = z.infer<typeof recurringInvoiceSchema>;

const paymentTermsOptions = [
  { value: "net-15", label: "Net 15" },
  { value: "net-30", label: "Net 30" },
  { value: "net-45", label: "Net 45" },
  { value: "net-60", label: "Net 60" },
  { value: "due-on-receipt", label: "Due on Receipt" },
];

export function RecurringInvoiceForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Array<{ id: string; _id: string; name: string; company: string }>>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const result = await getCustomers();
      if (result.success && result.data) {
        setCustomers(result.data.map((c: any) => ({
          _id: c._id,
          id: c._id,
          name: c.name,
          company: c.company || "",
        })));
      }
    };
    fetchCustomers();
  }, []);

  const form = useForm<RecurringInvoiceFormValues>({
    resolver: zodResolver(recurringInvoiceSchema),
    defaultValues: {
      profileName: "",
      customerId: "",
      frequency: "monthly",
      startDate: new Date(),
      endDate: undefined,
      neverExpires: true,
      paymentTerms: "net-30",
      lineItems: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
      notes: "",
      terms: "",
      autoSend: true,
      revenueAccountId: "",
      receivableAccountId: "",
      taxAccountId: "",
    },
  });

  const lineItems = form.watch("lineItems");
  const neverExpires = form.watch("neverExpires");

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  };

  const addLineItem = () => {
    const currentItems = form.getValues("lineItems");
    form.setValue("lineItems", [
      ...currentItems,
      { description: "", quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const removeLineItem = (index: number) => {
    const currentItems = form.getValues("lineItems");
    if (currentItems.length > 1) {
      form.setValue(
        "lineItems",
        currentItems.filter((_, i) => i !== index)
      );
    }
  };

  const onSubmit = async (data: RecurringInvoiceFormValues) => {
    setIsSubmitting(true);
    try {
      const subtotal = calculateTotal();
      const taxAmount = 0; // Add tax calculation if needed
      const totalAmount = subtotal + taxAmount;

      const result = await createRecurringInvoice({
        profileName: data.profileName,
        customerId: data.customerId,
        frequency: data.frequency,
        startDate: data.startDate,
        endDate: data.neverExpires ? undefined : data.endDate,
        nextDate: data.startDate,
        lineItems: data.lineItems,
        subtotal,
        taxRate: 0,
        taxAmount,
        totalAmount,
        status: "active",
        autoSend: data.autoSend,
        paymentTerms: data.paymentTerms,
        revenueAccountId: data.revenueAccountId || undefined,
        receivableAccountId: data.receivableAccountId || undefined,
        taxAccountId: data.taxAccountId || undefined,
        notes: data.notes,
        terms: data.terms,
      }, window.location.pathname);

      if (result.success) {
        toast.success("Recurring invoice profile created successfully");
        router.push("../");
      } else {
        toast.error(result.error || "Failed to create recurring invoice");
      }
    } catch (error) {
      console.error("Error creating recurring invoice:", error);
      toast.error("Failed to create recurring invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recurring Invoices
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Details */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Set up the recurring invoice profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="profileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Monthly Retainer - Client Name" />
                      </FormControl>
                      <FormDescription>
                        A descriptive name to identify this recurring invoice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer *</FormLabel>
                      <FormControl>
                        <CustomerCombobox
                          value={field.value}
                          onChange={field.onChange}
                          customers={customers}
                          onCustomerAdded={(newCustomer) => {
                            setCustomers([...customers, newCustomer]);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Schedule Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Settings</CardTitle>
                <CardDescription>Configure when invoices should be generated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly (Every 3 months)</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : "Pick date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>First invoice generation date</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={neverExpires}
                              >
                                {field.value ? format(field.value, "PPP") : "Pick date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>Last invoice generation date</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="neverExpires"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Never Expires</FormLabel>
                        <FormDescription>
                          Continue generating invoices indefinitely
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentTermsOptions.map((term) => (
                            <SelectItem key={term.value} value={term.value}>
                              {term.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="autoSend"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Auto-Send Invoices</FormLabel>
                        <FormDescription>
                          Automatically email invoices to customer when generated
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Line Items</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lineItems.map((item, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-12 gap-3">
                          <div className="col-span-6">
                            <FormField
                              control={form.control}
                              name={`lineItems.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Description *</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Item description" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="col-span-2">
                            <FormField
                              control={form.control}
                              name={`lineItems.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Qty *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) => {
                                        const value = parseFloat(e.target.value) || 0;
                                        field.onChange(value);
                                        const rate = form.getValues(`lineItems.${index}.rate`);
                                        form.setValue(`lineItems.${index}.amount`, value * rate);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="col-span-2">
                            <FormField
                              control={form.control}
                              name={`lineItems.${index}.rate`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Rate *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) => {
                                        const value = parseFloat(e.target.value) || 0;
                                        field.onChange(value);
                                        const qty = form.getValues(`lineItems.${index}.quantity`);
                                        form.setValue(`lineItems.${index}.amount`, qty * value);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="col-span-2 flex items-end">
                            <div className="text-sm font-semibold text-right w-full pb-2">
                              GHS {(item.quantity * item.rate).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {lineItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="mt-6"
                            onClick={() => removeLineItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Add any notes for the customer..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Payment terms, late fees, etc..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Accounting Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Accounting (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Leave blank to use default accounts. Select specific accounts to override defaults.
                </p>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="revenueAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revenue Account</FormLabel>
                        <FormControl>
                          <AccountSelector
                            label=""
                            accountType="revenue"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Default: Sales Revenue"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="receivableAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accounts Receivable</FormLabel>
                        <FormControl>
                          <AccountSelector
                            label=""
                            accountType="asset"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Default: Accounts Receivable"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Account</FormLabel>
                        <FormControl>
                          <AccountSelector
                            label=""
                            accountType="liability"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Default: VAT Payable"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <RefreshCw className="h-4 w-4 text-emerald-600" />
                    <span className="text-muted-foreground">Recurring</span>
                  </div>
                  <div className="text-lg font-semibold capitalize">
                    {form.watch("frequency")}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Invoice Amount</span>
                  <span className="text-emerald-600">GHS {calculateTotal().toFixed(2)}</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Creating..." : "Create Profile"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
