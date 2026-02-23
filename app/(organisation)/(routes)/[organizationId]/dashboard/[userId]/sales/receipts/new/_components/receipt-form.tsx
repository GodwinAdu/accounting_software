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
import { createReceipt, updateReceipt } from "@/lib/actions/receipt.action";
import { getAccounts } from "@/lib/actions/account.action";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import { CustomerCombobox } from "./customer-combobox";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description required"),
  quantity: z.number().min(0.01, "Quantity must be positive"),
  rate: z.number().min(0, "Rate must be positive"),
  amount: z.number(),
});

const receiptSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  receiptNumber: z.string().min(1, "Receipt number is required"),
  receiptDate: z.date(),
  paymentMethod: z.enum(["cash", "card", "mobile_money", "bank_transfer"]),
  bankAccountId: z.string().optional(),
  revenueAccountId: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item required"),
  notes: z.string().optional(),
});

type ReceiptFormValues = z.infer<typeof receiptSchema>;

const mockCustomers = [
  { id: "1", name: "Kwame Mensah", company: "Tech Solutions Ltd" },
  { id: "2", name: "Ama Asante", company: "Retail Plus Ghana" },
  { id: "3", name: "Kofi Boateng", company: "Construction Co." },
];

type Customer = {
  _id: string;
  name: string;
  company?: string;
};

type Account = {
  _id: string;
  accountName: string;
  accountCode: string;
  accountType: string;
};

type ReceiptFormProps = {
  initialData?: any;
};

export function ReceiptForm({ initialData }: ReceiptFormProps) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const isEditMode = !!initialData;

  useEffect(() => {
    const fetchData = async () => {
      const [customersResult, accountsResult] = await Promise.all([
        getCustomers(),
        getAccounts()
      ]);
      
      if (customersResult.success && customersResult.data) {
        setCustomers(customersResult.data.map((c: any) => ({
          _id: c._id,
          name: c.name,
          company: c.company || "",
        })));
      }
      
      if (accountsResult.success && accountsResult.data) {
        setAccounts(accountsResult.data.map((a: any) => ({
          _id: a._id,
          accountName: a.accountName,
          accountCode: a.accountCode,
          accountType: a.accountType,
        })));
      }
    };
    fetchData();
  }, []);

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    defaultValues: initialData ? {
      customerId: initialData.customerId?._id || initialData.customerId || "",
      receiptNumber: initialData.receiptNumber || `REC-${Date.now().toString().slice(-6)}`,
      receiptDate: initialData.receiptDate ? new Date(initialData.receiptDate) : new Date(),
      paymentMethod: initialData.paymentMethod || "cash",
      bankAccountId: initialData.bankAccountId || "",
      revenueAccountId: initialData.revenueAccountId || "",
      lineItems: initialData.lineItems || [{ description: "", quantity: 1, rate: 0, amount: 0 }],
      notes: initialData.notes || "",
    } : {
      customerId: "",
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      receiptDate: new Date(),
      paymentMethod: "cash",
      bankAccountId: "",
      revenueAccountId: "",
      lineItems: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
      notes: "",
    },
  });

  const lineItems = form.watch("lineItems");

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

  const onSubmit = async (data: ReceiptFormValues) => {
    setIsSubmitting(true);
    try {
      const receiptData: any = {
        customerId: data.customerId,
        receiptDate: data.receiptDate,
        paymentMethod: data.paymentMethod,
        bankAccountId: data.bankAccountId || undefined,
        revenueAccountId: data.revenueAccountId || undefined,
        lineItems: data.lineItems,
        totalAmount: calculateTotal(),
        notes: data.notes,
      };

      const result = isEditMode
        ? await updateReceipt(initialData._id, receiptData, pathname)
        : await createReceipt(receiptData, pathname);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Receipt ${isEditMode ? "updated" : "created"} successfully`);
        router.push(`/${params.organizationId}/dashboard/${params.userId}/sales/receipts`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} receipt:`, error);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} receipt`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Receipts
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Receipt Details</CardTitle>
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

                  <FormField
                    control={form.control}
                    name="receiptNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receipt Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="REC-001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="receiptDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Receipt Date *</FormLabel>
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
                            <SelectItem value="mobile_money">Mobile Money</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankAccountId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank/Cash Account</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Default: Cash" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accounts
                              .filter(a => a.accountType === 'asset')
                              .map(account => (
                                <SelectItem key={account._id} value={account._id}>
                                  {account.accountCode} - {account.accountName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">Select the account where payment was received</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            {accounts
                              .filter(a => a.accountType === 'revenue')
                              .map(account => (
                                <SelectItem key={account._id} value={account._id}>
                                  {account.accountCode} - {account.accountName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">Select the income category for this transaction</p>
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
                                    <Input {...field} placeholder="Item or service description" />
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
                        <Textarea
                          {...field}
                          placeholder="Add any notes about this receipt..."
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

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
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
                    {isSubmitting ? "Saving..." : isEditMode ? "Update Receipt" : "Save Receipt"}
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
