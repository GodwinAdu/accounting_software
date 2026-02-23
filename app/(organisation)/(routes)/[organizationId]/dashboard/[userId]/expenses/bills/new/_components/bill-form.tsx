"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { VendorCombobox } from "../../../all/new/_components/vendor-combobox";
import { CategoryCombobox } from "../../../all/new/_components/category-combobox";
import { AccountSelector } from "@/components/forms/account-selector";
import { getVendors } from "@/lib/actions/vendor.action";
import { getExpenseCategories } from "@/lib/actions/expense-category.action";
import { createBill } from "@/lib/actions/bill.action";

const billSchema = z.object({
  billNumber: z.string().min(1, "Bill number is required"),
  vendorId: z.string().min(1, "Vendor is required"),
  billDate: z.date(),
  dueDate: z.date(),
  reference: z.string().optional(),
  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    categoryId: z.string().optional(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    amount: z.number(),
  })).min(1, "At least one item is required"),
  notes: z.string().optional(),
  expenseAccountId: z.string().optional(),
  payableAccountId: z.string().optional(),
  taxAccountId: z.string().optional(),
});

type BillFormValues = z.infer<typeof billSchema>;

export function BillForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      billNumber: `BILL-${Date.now().toString().slice(-6)}`,
      vendorId: "",
      billDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      reference: "",
      items: [{ description: "", categoryId: "", quantity: 1, unitPrice: 0, amount: 0 }],
      notes: "",
      expenseAccountId: "",
      payableAccountId: "",
      taxAccountId: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = form.watch("items");
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [vendorsRes, categoriesRes] = await Promise.all([
        getVendors(),
        getExpenseCategories(),
      ]);

      if (vendorsRes.success && vendorsRes.data) {
        setVendors(vendorsRes.data.map((v: any) => ({ id: v._id, name: v.companyName })));
      }

      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data.map((c: any) => ({ id: c._id, name: c.name })));
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = (index: number) => {
    const item = items[index];
    const amount = item.quantity * item.unitPrice;
    form.setValue(`items.${index}.amount`, amount);
  };

  const onSubmit = async (data: BillFormValues) => {
    setIsSubmitting(true);
    try {
      const billData: any = {
        vendorId: data.vendorId,
        billNumber: data.billNumber,
        billDate: data.billDate,
        dueDate: data.dueDate,
        reference: data.reference,
        items: data.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount
        })),
        notes: data.notes,
        subtotal: subtotal,
        taxAmount: 0,
        total: subtotal,
        amountPaid: 0,
        balance: subtotal,
        status: "draft" as const,
      };

      // Only add account IDs if they are not empty
      if (data.expenseAccountId) billData.expenseAccountId = data.expenseAccountId;
      if (data.payableAccountId) billData.payableAccountId = data.payableAccountId;
      if (data.taxAccountId) billData.taxAccountId = data.taxAccountId;

      const result = await createBill(billData, window.location.pathname);
      
      if (result.error) {
        toast.error("Failed to create bill", { description: result.error });
        return;
      }

      toast.success("Bill created successfully");
      router.push("../");
    } catch (error) {
      console.error("Error creating bill:", error);
      toast.error("Failed to create bill");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bills
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bill Information</CardTitle>
                <CardDescription>Enter vendor bill details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bill Number *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vendorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor *</FormLabel>
                        <FormControl>
                          <VendorCombobox
                            value={field.value}
                            onChange={field.onChange}
                            vendors={vendors}
                            onVendorAdded={(newVendor) => setVendors([...vendors, newVendor])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Bill Date *</FormLabel>
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
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date *</FormLabel>
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
                </div>

                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Vendor invoice number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Item description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.categoryId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <FormControl>
                            <CategoryCombobox
                              value={field.value}
                              onChange={field.onChange}
                              categories={categories}
                              onCategoryAdded={(newCategory) => setCategories([...categories, newCategory])}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                  calculateAmount(index);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit Price (GHS) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                  calculateAmount(index);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (GHS)</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value.toFixed(2)} disabled />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ description: "", categoryId: "", quantity: 1, unitPrice: 0, amount: 0 })}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea {...field} placeholder="Add any notes..." rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accounting (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Leave blank to use default accounts
                </p>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="expenseAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expense Account</FormLabel>
                        <FormControl>
                          <AccountSelector
                            label=""
                            accountType="expense"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Default: Cost of Goods Sold"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="payableAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accounts Payable</FormLabel>
                        <FormControl>
                          <AccountSelector
                            label=""
                            accountType="liability"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Default: Accounts Payable"
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

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Bill Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">GHS {subtotal.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">GHS {subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Bill"}
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
