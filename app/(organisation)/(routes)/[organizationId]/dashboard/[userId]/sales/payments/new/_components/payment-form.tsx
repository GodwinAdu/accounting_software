"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, CalendarIcon, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getCustomers } from "@/lib/actions/customer.action";
import { getInvoices } from "@/lib/actions/invoice.action";
import { createPayment, updatePayment } from "@/lib/actions/payment.action";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AccountSelector } from "@/components/forms/account-selector";
import { CustomerCombobox } from "./customer-combobox";

const paymentSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  invoiceId: z.string().optional(),
  paymentNumber: z.string().min(1, "Payment number is required"),
  paymentDate: z.date(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  paymentMethod: z.enum(["bank_transfer", "cash", "cheque", "mobile_money", "card"]),
  reference: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  chequeNumber: z.string().optional(),
  mobileProvider: z.string().optional(),
  mobileNumber: z.string().optional(),
  notes: z.string().optional(),
  bankAccountId: z.string().optional(),
  receivableAccountId: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const mockCustomers = [
  { id: "1", name: "Kwame Mensah", company: "Tech Solutions Ltd" },
  { id: "2", name: "Ama Asante", company: "Retail Plus Ghana" },
  { id: "3", name: "Kofi Boateng", company: "Construction Co." },
];

const mockInvoices = [
  { id: "1", number: "INV-001", amount: 5000, balance: 5000, customerId: "1" },
  { id: "2", number: "INV-002", amount: 12500, balance: 12500, customerId: "2" },
  { id: "3", number: "INV-003", amount: 8000, balance: 3000, customerId: "3" },
];

const ghanaBanks = [
  "GCB Bank", "Ecobank Ghana", "Stanbic Bank", "Absa Bank", 
  "Fidelity Bank", "Zenith Bank", "Access Bank", "Prudential Bank"
];

const mobileProviders = ["MTN Mobile Money", "Vodafone Cash", "AirtelTigo Money"];

type Customer = {
  _id: string;
  name: string;
  company?: string;
};

type Invoice = {
  _id: string;
  invoiceNumber: string;
  totalAmount: number;
  customerId: string | { _id: string };
};

type PaymentFormProps = {
  initialData?: any;
};

export function PaymentForm({ initialData }: PaymentFormProps) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const isEditMode = !!initialData;

  useEffect(() => {
    const fetchData = async () => {
      const [customersResult, invoicesResult] = await Promise.all([
        getCustomers(),
        getInvoices(),
      ]);
      
      if (customersResult.success && customersResult.data) {
        setCustomers(customersResult.data);
      }
      
      if (invoicesResult.success && invoicesResult.data) {
        const unpaidInvoices = invoicesResult.data.filter(
          (inv: any) => inv.status !== "paid" && inv.status !== "cancelled"
        );
        setInvoices(unpaidInvoices);
      }
    };
    fetchData();
  }, []);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData ? {
      customerId: initialData.customerId?._id || initialData.customerId || "",
      invoiceId: initialData.invoiceId?._id || initialData.invoiceId || "",
      paymentNumber: initialData.paymentNumber || `PAY-${Date.now().toString().slice(-6)}`,
      paymentDate: initialData.paymentDate ? new Date(initialData.paymentDate) : new Date(),
      amount: initialData.amount || 0,
      paymentMethod: initialData.paymentMethod || "bank_transfer",
      reference: initialData.reference || "",
      bankName: initialData.bankName || "",
      accountNumber: initialData.accountNumber || "",
      chequeNumber: initialData.chequeNumber || "",
      mobileProvider: initialData.mobileProvider || "",
      mobileNumber: initialData.mobileNumber || "",
      notes: initialData.notes || "",
      bankAccountId: initialData.bankAccountId || "",
      receivableAccountId: initialData.receivableAccountId || "",
    } : {
      customerId: "",
      invoiceId: "",
      paymentNumber: `PAY-${Date.now().toString().slice(-6)}`,
      paymentDate: new Date(),
      amount: 0,
      paymentMethod: "bank_transfer",
      reference: "",
      bankName: "",
      accountNumber: "",
      chequeNumber: "",
      mobileProvider: "",
      mobileNumber: "",
      notes: "",
      bankAccountId: "",
      receivableAccountId: "",
    },
  });

  const selectedCustomerId = form.watch("customerId");
  const paymentMethod = form.watch("paymentMethod");
  const selectedInvoiceId = form.watch("invoiceId");

  const filteredInvoices = invoices.filter(
    (inv) => {
      const custId = typeof inv.customerId === "string" ? inv.customerId : inv.customerId?._id;
      return custId === selectedCustomerId;
    }
  );

  const selectedInvoice = invoices.find((inv) => inv._id === selectedInvoiceId);

  const onSubmit = async (data: PaymentFormValues) => {
    setIsSubmitting(true);
    try {
      const paymentData: any = {
        customerId: data.customerId,
        invoiceId: data.invoiceId || undefined,
        paymentNumber: data.paymentNumber,
        paymentDate: data.paymentDate,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        reference: data.reference || undefined,
        bankName: data.bankName || undefined,
        chequeNumber: data.chequeNumber || undefined,
        mobileProvider: data.mobileProvider || undefined,
        notes: data.notes || undefined,
        bankAccountId: data.bankAccountId || undefined,
        receivableAccountId: data.receivableAccountId || undefined,
      };

      const result = isEditMode
        ? await updatePayment(initialData._id, paymentData, pathname)
        : await createPayment(paymentData, pathname);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Payment ${isEditMode ? "updated" : "recorded"} successfully`);
        router.push(`/${params.organizationId}/dashboard/${params.userId}/sales/payments`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "recording"} payment:`, error);
      toast.error(`Failed to ${isEditMode ? "update" : "record"} payment`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Payments
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Enter the payment details</CardDescription>
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
                    name="invoiceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice (Optional)</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            const invoice = invoices.find(inv => inv._id === value);
                            if (invoice) {
                              form.setValue("amount", invoice.totalAmount);
                            }
                          }} 
                          defaultValue={field.value}
                          disabled={!selectedCustomerId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select invoice or leave blank" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredInvoices.length > 0 ? (
                              filteredInvoices.map((invoice) => (
                                <SelectItem key={invoice._id} value={invoice._id}>
                                  {invoice.invoiceNumber} - GHS {invoice.totalAmount.toLocaleString()}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none" disabled>
                                No unpaid invoices
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Leave blank for general payments not linked to an invoice
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="PAY-001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Payment Date *</FormLabel>
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
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select how the payment was received</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-5 gap-4"
                        >
                          <div>
                            <RadioGroupItem
                              value="bank_transfer"
                              id="bank_transfer"
                              className="peer sr-only"
                            />
                            <label
                              htmlFor="bank_transfer"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-600 [&:has([data-state=checked])]:border-emerald-600 cursor-pointer"
                            >
                              <DollarSign className="mb-3 h-6 w-6" />
                              <span className="text-sm font-medium">Bank Transfer</span>
                            </label>
                          </div>
                          <div>
                            <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                            <label
                              htmlFor="cash"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-600 [&:has([data-state=checked])]:border-emerald-600 cursor-pointer"
                            >
                              <DollarSign className="mb-3 h-6 w-6" />
                              <span className="text-sm font-medium">Cash</span>
                            </label>
                          </div>
                          <div>
                            <RadioGroupItem value="cheque" id="cheque" className="peer sr-only" />
                            <label
                              htmlFor="cheque"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-600 [&:has([data-state=checked])]:border-emerald-600 cursor-pointer"
                            >
                              <DollarSign className="mb-3 h-6 w-6" />
                              <span className="text-sm font-medium">Cheque</span>
                            </label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="mobile_money"
                              id="mobile_money"
                              className="peer sr-only"
                            />
                            <label
                              htmlFor="mobile_money"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-600 [&:has([data-state=checked])]:border-emerald-600 cursor-pointer"
                            >
                              <DollarSign className="mb-3 h-6 w-6" />
                              <span className="text-sm font-medium">Mobile Money</span>
                            </label>
                          </div>
                          <div>
                            <RadioGroupItem value="card" id="card" className="peer sr-only" />
                            <label
                              htmlFor="card"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-emerald-600 [&:has([data-state=checked])]:border-emerald-600 cursor-pointer"
                            >
                              <DollarSign className="mb-3 h-6 w-6" />
                              <span className="text-sm font-medium">Card</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Bank Transfer Fields */}
                {paymentMethod === "bank_transfer" && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bank" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ghanaBanks.map((bank) => (
                                <SelectItem key={bank} value={bank}>
                                  {bank}
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
                      name="reference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction Reference</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="TRX123456" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Cheque Fields */}
                {paymentMethod === "cheque" && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="chequeNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cheque Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="CHQ-123456" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bank" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ghanaBanks.map((bank) => (
                                <SelectItem key={bank} value={bank}>
                                  {bank}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Mobile Money Fields */}
                {paymentMethod === "mobile_money" && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mobileProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Money Provider</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mobileProviders.map((provider) => (
                                <SelectItem key={provider} value={provider}>
                                  {provider}
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
                      name="reference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction Reference</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="MM123456789" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Card Fields */}
                {paymentMethod === "card" && (
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Reference</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="CARD-123456" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Cash - No additional fields */}
                {paymentMethod === "cash" && (
                  <div className="text-sm text-muted-foreground">
                    No additional information required for cash payments
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
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
                        <Textarea
                          {...field}
                          placeholder="Add any additional notes about this payment..."
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Accounting */}
            <Card>
              <CardHeader>
                <CardTitle>Accounting (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Leave blank to use default accounts
                </p>
                
                <FormField
                  control={form.control}
                  name="bankAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Account</FormLabel>
                      <FormControl>
                        <AccountSelector
                          label=""
                          accountType="asset"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Default: Cash/Bank"
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
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedInvoice && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Invoice</span>
                        <span className="font-mono font-semibold">{selectedInvoice.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Invoice Amount</span>
                        <span className="font-medium">GHS {selectedInvoice.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Outstanding Balance</span>
                        <span className="font-medium text-orange-600">
                          GHS {selectedInvoice.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                <div className="flex justify-between text-lg font-bold">
                  <span>Payment Amount</span>
                  <span className="text-emerald-600">
                    GHS {form.watch("amount").toLocaleString()}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Recording..." : isEditMode ? "Update Payment" : "Record Payment"}
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
