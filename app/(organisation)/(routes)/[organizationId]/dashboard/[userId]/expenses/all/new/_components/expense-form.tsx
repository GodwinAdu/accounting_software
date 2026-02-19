"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createExpense } from "@/lib/actions/expense.action";
import { getVendors } from "@/lib/actions/vendor.action";
import { getExpenseCategories } from "@/lib/actions/expense-category.action";
import { getCustomers } from "@/lib/actions/customer.action";

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
import { VendorCombobox } from "./vendor-combobox";
import { CategoryCombobox } from "./category-combobox";
import { CustomerCombobox } from "./customer-combobox";

const expenseSchema = z.object({
  expenseNumber: z.string().min(1, "Expense number is required"),
  date: z.date(),
  vendorId: z.string().optional(),
  categoryId: z.string().optional(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  paymentMethod: z.enum(["cash", "card", "bank_transfer", "mobile_money", "cheque"]),
  reference: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  notes: z.string().optional(),
  billable: z.boolean().default(false),
  customerId: z.string().optional(),
  taxAmount: z.number().min(0).default(0),
  hasReceipt: z.boolean().default(false),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export function ExpenseForm() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [vendorsResult, categoriesResult, customersResult] = await Promise.all([
        getVendors(),
        getExpenseCategories(),
        getCustomers(),
      ]);

      if (vendorsResult.success) {
        setVendors(vendorsResult.data.map((v: any) => ({ id: v._id, name: v.companyName })));
      }

      if (categoriesResult.success) {
        setCategories(categoriesResult.data.map((c: any) => ({ id: c._id, name: c.name })));
      }

      if (customersResult.success) {
        setCustomers(customersResult.data.map((c: any) => ({ id: c._id, name: c.name, email: c.email })));
      }
    };

    fetchData();
  }, []);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseNumber: `EXP-${Date.now().toString().slice(-6)}`,
      date: new Date(),
      vendorId: "",
      categoryId: "",
      amount: 0,
      paymentMethod: "cash",
      reference: "",
      description: "",
      notes: "",
      billable: false,
      customerId: "",
      taxAmount: 0,
      hasReceipt: false,
    },
  });

  const billable = form.watch("billable");
  const amount = form.watch("amount");
  const taxAmount = form.watch("taxAmount");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      form.setValue("hasReceipt", true);
    }
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    form.setValue("hasReceipt", false);
  };

  const onSubmit = async (data: ExpenseFormValues) => {
    setIsSubmitting(true);
    try {
      const expenseData = {
        date: data.date,
        vendorId: data.vendorId,
        categoryId: data.categoryId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        reference: data.reference,
        description: data.description,
        notes: data.notes,
        status: "pending" as const,
      };

      const result = await createExpense(expenseData, pathname);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Expense created successfully");
        router.push(`/${params.organizationId}/dashboard/${params.userId}/expenses/all`);
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      toast.error("Failed to create expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Expenses
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Information</CardTitle>
                <CardDescription>Enter the basic expense details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expense Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="EXP-001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date *</FormLabel>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                            onVendorAdded={(newVendor) => {
                              setVendors([...vendors, newVendor]);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <FormControl>
                          <CategoryCombobox
                            value={field.value}
                            onChange={field.onChange}
                            categories={categories}
                            onCategoryAdded={(newCategory) => {
                              setCategories([...categories, newCategory]);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Brief description of the expense" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (GHS) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Amount (GHS)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>VAT or other taxes included</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="mobile_money">Mobile Money</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Transaction reference" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Receipt Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Receipt</CardTitle>
                <CardDescription>Upload receipt or proof of payment</CardDescription>
              </CardHeader>
              <CardContent>
                {!receiptFile ? (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Click to upload or drag and drop
                    </p>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-emerald-100 rounded flex items-center justify-center">
                        <Upload className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">{receiptFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(receiptFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeReceipt}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Billable Expense */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="billable"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Billable Expense</FormLabel>
                        <FormDescription>
                          This expense can be billed to a customer
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {billable && (
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <FormControl>
                          <CustomerCombobox
                            value={field.value}
                            onValueChange={field.onChange}
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
                )}

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Add any additional notes..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Expense Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">GHS {amount.toFixed(2)}</span>
                  </div>

                  {taxAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">GHS {taxAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">GHS {(amount + taxAmount).toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Expense"}
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
