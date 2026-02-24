"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getCustomers } from "@/lib/actions/customer.action";
import { getInvoices } from "@/lib/actions/invoice.action";
import { getAccounts } from "@/lib/actions/account.action";
import { createCreditNote, updateCreditNote } from "@/lib/actions/credit-note.action";
import { toast } from "sonner";
import { CustomerCombobox } from "./customer-combobox";
import { InvoiceCombobox } from "./invoice-combobox";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description required"),
  quantity: z.number().min(0.01, "Quantity must be positive"),
  unitPrice: z.number().min(0, "Price must be positive"),
  amount: z.number(),
});

const creditNoteSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  invoiceId: z.string().optional(),
  date: z.date(),
  reason: z.string().optional(),
  items: z.array(lineItemSchema).min(1, "At least one item required"),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  status: z.enum(["draft", "issued", "applied"]),
  revenueAccountId: z.string().optional(),
  receivableAccountId: z.string().optional(),
  notes: z.string().optional(),
});

type CreditNoteFormValues = z.infer<typeof creditNoteSchema>;

type Customer = { _id: string; name: string; company?: string };
type Invoice = { _id: string; invoiceNumber: string };
type Account = { _id: string; accountName: string; accountCode: string; accountType: string; isParent?: boolean };

type CreditNoteFormProps = { initialData?: any };

export function CreditNoteForm({ initialData }: CreditNoteFormProps) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const isEditMode = !!initialData;

  useEffect(() => {
    const fetchData = async () => {
      const [customersResult, invoicesResult, accountsResult] = await Promise.all([
        getCustomers(),
        getInvoices(),
        getAccounts()
      ]);
      
      if (customersResult.success && customersResult.data) {
        setCustomers(customersResult.data.map((c: any) => ({ _id: c._id, name: c.name, company: c.company || "" })));
      }
      
      if (invoicesResult.success && invoicesResult.data) {
        setInvoices(invoicesResult.data.map((i: any) => ({ _id: i._id, invoiceNumber: i.invoiceNumber })));
      }
      
      if (accountsResult.success && accountsResult.data) {
        setAccounts(accountsResult.data.map((a: any) => ({ _id: a._id, accountName: a.accountName, accountCode: a.accountCode, accountType: a.accountType, isParent: a.isParent })));
      }
    };
    fetchData();
  }, []);

  const form = useForm<CreditNoteFormValues>({
    resolver: zodResolver(creditNoteSchema),
    defaultValues: initialData ? {
      customerId: initialData.customerId?._id || initialData.customerId || "",
      invoiceId: initialData.invoiceId?._id || initialData.invoiceId || "",
      date: initialData.date ? new Date(initialData.date) : new Date(),
      reason: initialData.reason || "",
      items: initialData.items || [{ description: "", quantity: 1, unitPrice: 0, amount: 0 }],
      subtotal: initialData.subtotal || 0,
      tax: initialData.tax || 0,
      total: initialData.total || 0,
      status: initialData.status || "draft",
      revenueAccountId: initialData.revenueAccountId || "",
      receivableAccountId: initialData.receivableAccountId || "",
      notes: initialData.notes || "",
    } : {
      customerId: "",
      invoiceId: "",
      date: new Date(),
      reason: "",
      items: [{ description: "", quantity: 1, unitPrice: 0, amount: 0 }],
      subtotal: 0,
      tax: 0,
      total: 0,
      status: "draft",
      revenueAccountId: "",
      receivableAccountId: "",
      notes: "",
    },
  });

  const items = form.watch("items");
  const tax = form.watch("tax");

  const calculateSubtotal = () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const calculateTotal = () => calculateSubtotal() + tax;

  useEffect(() => {
    form.setValue("subtotal", calculateSubtotal());
    form.setValue("total", calculateTotal());
  }, [items, tax]);

  const addLineItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [...currentItems, { description: "", quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const removeLineItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue("items", currentItems.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: CreditNoteFormValues) => {
    setIsSubmitting(true);
    try {
      const creditNoteData: any = {
        customerId: data.customerId,
        invoiceId: data.invoiceId || undefined,
        date: data.date,
        reason: data.reason,
        items: data.items,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        status: data.status,
        revenueAccountId: data.revenueAccountId || undefined,
        receivableAccountId: data.receivableAccountId || undefined,
        notes: data.notes,
      };

      const result = isEditMode
        ? await updateCreditNote(initialData._id, creditNoteData, pathname)
        : await createCreditNote(creditNoteData, pathname);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Credit note ${isEditMode ? "updated" : "created"} successfully`);
        router.push(`/${params.organizationId}/dashboard/${params.userId}/sales/credit-notes`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} credit note:`, error);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} credit note`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Credit Notes
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Credit Note Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer *</FormLabel>
                        <FormControl>
                          <CustomerCombobox value={field.value} onChange={field.onChange} customers={customers} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="invoiceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Invoice (Optional)</FormLabel>
                        <FormControl>
                          <InvoiceCombobox value={field.value || ""} onChange={field.onChange} invoices={invoices} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, "PPP") : "Pick date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="issued">Issued</SelectItem>
                            <SelectItem value="applied">Applied</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Product return, Overcharge correction" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="revenueAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revenue Account</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Default: Sales Revenue" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accounts.filter(a => a.accountType === 'revenue' && !a.isParent).map(account => (
                              <SelectItem key={account._id} value={account._id}>
                                {account.accountCode} - {account.accountName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">Select the income account where the original sale was recorded</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="receivableAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receivable Account</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Default: Accounts Receivable" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accounts.filter(a => a.accountType === 'asset' && !a.isParent).map(account => (
                              <SelectItem key={account._id} value={account._id}>
                                {account.accountCode} - {account.accountName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">Select the account that tracks outstanding customer payments</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

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
                  {items.map((item, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-12 gap-3">
                          <div className="col-span-6">
                            <FormField
                              control={form.control}
                              name={`items.${index}.description`}
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
                              name={`items.${index}.quantity`}
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
                                        const price = form.getValues(`items.${index}.unitPrice`);
                                        form.setValue(`items.${index}.amount`, value * price);
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
                              name={`items.${index}.unitPrice`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Price *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) => {
                                        const value = parseFloat(e.target.value) || 0;
                                        field.onChange(value);
                                        const qty = form.getValues(`items.${index}.quantity`);
                                        form.setValue(`items.${index}.amount`, qty * value);
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
                              GHS {(item.quantity * item.unitPrice).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {items.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" className="mt-6" onClick={() => removeLineItem(index)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} placeholder="Add any notes about this credit note..." rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>GHS {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="tax"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Tax</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              className="w-24 h-8 text-right"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-red-600">-GHS {calculateTotal().toFixed(2)}</span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Saving..." : isEditMode ? "Update Credit Note" : "Save Credit Note"}
                  </Button>

                  <Button type="button" variant="outline" className="w-full" onClick={() => router.back()} disabled={isSubmitting}>
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
