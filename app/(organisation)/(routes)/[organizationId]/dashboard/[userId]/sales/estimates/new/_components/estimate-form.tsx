"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Plus, Trash2, Save, Send, ArrowLeft, Eye, Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useReactToPrint } from "react-to-print";

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
import { createEstimate, updateEstimate } from "@/lib/actions/estimate.action";
import { usePathname, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description required"),
  quantity: z.number().min(0.01, "Quantity must be positive"),
  rate: z.number().min(0, "Rate must be positive"),
  taxRate: z.number().min(0).max(100),
  amount: z.number(),
});

const estimateSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  estimateNumber: z.string().min(1, "Estimate number is required"),
  estimateDate: z.date(),
  expiryDate: z.date(),
  reference: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item required"),
  notes: z.string().optional(),
  terms: z.string().optional(),
  discount: z.number().min(0).max(100),
  discountType: z.enum(["percentage", "fixed"]),
  taxType: z.enum(["inclusive", "exclusive"]),
});

type EstimateFormValues = z.infer<typeof estimateSchema>;

type Customer = {
  _id: string;
  name: string;
  company?: string;
  email?: string;
};

type EstimateFormProps = {
  organizationId?: string;
  userId?: string;
  customers?: Customer[];
  initialData?: any;
};

export function EstimateForm({ organizationId, userId, customers: initialCustomers = [], initialData }: EstimateFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const isEditMode = !!initialData;

  const orgId = organizationId || String(params.organizationId);
  const usrId = userId || String(params.userId);

  const form = useForm<EstimateFormValues>({
    resolver: zodResolver(estimateSchema),
    defaultValues: initialData ? {
      customerId: initialData.customerId?._id || initialData.customerId || "",
      estimateNumber: initialData.estimateNumber || `EST-${Date.now().toString().slice(-6)}`,
      estimateDate: initialData.estimateDate ? new Date(initialData.estimateDate) : new Date(),
      expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      reference: initialData.reference || "",
      lineItems: initialData.lineItems || [
        { description: "", quantity: 1, rate: 0, taxRate: 0, amount: 0 },
      ],
      notes: initialData.notes || "",
      terms: initialData.terms || "",
      discount: initialData.discount || 0,
      discountType: initialData.discountType || "percentage",
      taxType: initialData.taxType || "exclusive",
    } : {
      customerId: "",
      estimateNumber: `EST-${Date.now().toString().slice(-6)}`,
      estimateDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      reference: "",
      lineItems: [
        { description: "", quantity: 1, rate: 0, taxRate: 0, amount: 0 },
      ],
      notes: "",
      terms: "",
      discount: 0,
      discountType: "percentage",
      taxType: "exclusive",
    },
  });

  const lineItems = form.watch("lineItems");
  const discount = form.watch("discount");
  const discountType = form.watch("discountType");

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === "percentage") {
      return (subtotal * discount) / 100;
    }
    return discount;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const taxableAmount = subtotal - discountAmount;
    
    return lineItems.reduce((sum, item) => {
      const itemAmount = item.quantity * item.rate;
      const itemRatio = itemAmount / subtotal || 0;
      const itemTaxableAmount = taxableAmount * itemRatio;
      return sum + (itemTaxableAmount * item.taxRate) / 100;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discountAmount + tax;
  };

  const addLineItem = () => {
    const currentItems = form.getValues("lineItems");
    form.setValue("lineItems", [
      ...currentItems,
      { description: "", quantity: 1, rate: 0, taxRate: 0, amount: 0 },
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

  const onSubmit = async (data: EstimateFormValues, action: "draft" | "send") => {
    setIsSubmitting(true);
    try {
      const estimateData: any = {
        customerId: data.customerId,
        estimateDate: data.estimateDate,
        expiryDate: data.expiryDate,
        reference: data.reference,
        lineItems: data.lineItems,
        subtotal: calculateSubtotal(),
        taxAmount: calculateTax(),
        totalAmount: calculateTotal(),
        discount: calculateDiscount(),
        status: action === "draft" ? "draft" : "sent",
        notes: data.notes,
        terms: data.terms,
      };

      const result = isEditMode
        ? await updateEstimate(initialData._id, estimateData, pathname)
        : await createEstimate(estimateData, pathname);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Estimate ${isEditMode ? "updated" : action === "draft" ? "saved as draft" : "created and sent"}`);
        router.push(`/${orgId}/dashboard/${usrId}/sales/estimates`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} estimate:`, error);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} estimate`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const message = `*ESTIMATE ${form.watch("estimateNumber")}*%0A%0A` +
      `Customer: ${selectedCustomer?.name || "-"}%0A` +
      (selectedCustomer?.company ? `Company: ${selectedCustomer.company}%0A%0A` : "%0A") +
      `Estimate Date: ${format(form.watch("estimateDate"), "PPP")}%0A` +
      `Valid Until: ${format(form.watch("expiryDate"), "PPP")}%0A%0A` +
      `*Total Amount: GH₵ ${calculateTotal().toFixed(2)}*%0A%0A` +
      `Thank you for considering our services!%0A%0A` +
      `_Generated by PayFlow_`;
    
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const selectedCustomer = customers.find(c => c._id === form.watch("customerId"));

  return (
    <>
    <Form {...form}>
      <form className="space-y-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Estimates
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer & Estimate Details */}
            <Card>
              <CardHeader>
                <CardTitle>Estimate Details</CardTitle>
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
                    name="estimateNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimate Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="EST-001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="estimateDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Estimate Date *</FormLabel>
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
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date *</FormLabel>
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
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="PO-123" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                          <div className="col-span-5">
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
                                        form.setValue(
                                          `lineItems.${index}.amount`,
                                          value * rate
                                        );
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
                                        form.setValue(
                                          `lineItems.${index}.amount`,
                                          qty * value
                                        );
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
                              name={`lineItems.${index}.taxRate`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">Tax %</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(parseFloat(e.target.value) || 0)
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="col-span-1 flex items-end">
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
                      <FormLabel>Customer Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Add any notes visible to the customer..."
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
                          placeholder="Estimate validity, acceptance terms, etc..."
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
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Discount Settings */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-xs">Discount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel className="text-xs">Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">%</SelectItem>
                              <SelectItem value="fixed">GHS</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="taxType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Tax Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="exclusive">Tax Exclusive</SelectItem>
                            <SelectItem value="inclusive">Tax Inclusive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Calculations */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">GHS {calculateSubtotal().toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Discount {discountType === "percentage" ? `(${discount}%)` : ""}
                      </span>
                      <span className="font-medium text-emerald-600">
                        -GHS {calculateDiscount().toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">GHS {calculateTax().toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-emerald-600">GHS {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    type="button"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                    onClick={form.handleSubmit((data) => onSubmit(data, "send"))}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Save & Send
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={form.handleSubmit((data) => onSubmit(data, "draft"))}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    disabled={isSubmitting}
                    onClick={handlePreview}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>

    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between print:hidden">
            <span>Estimate Preview</span>
            <div className="flex gap-2">
              <Button onClick={handleDownloadPDF} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button onClick={handleWhatsAppShare} size="sm" variant="outline" className="bg-green-50 hover:bg-green-100 text-green-700">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </Button>
              <Button onClick={() => handlePrint()} size="sm" variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div ref={printRef} className="space-y-8 print:p-12 bg-white">
          {/* Company Header */}
          <div className="print:block hidden">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">PayFlow</h1>
                <p className="text-sm text-gray-600">Professional Payroll & Accounting</p>
                <p className="text-sm text-gray-600 mt-1">Accra, Ghana</p>
                <p className="text-sm text-gray-600">info@payflow.com | +233 XX XXX XXXX</p>
              </div>
              <div className="text-right">
                <div className="bg-emerald-600 text-white px-6 py-3 rounded-lg inline-block">
                  <p className="text-3xl font-bold">ESTIMATE</p>
                </div>
              </div>
            </div>
          </div>

          {/* Screen Header */}
          <div className="print:hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold">ESTIMATE</h2>
              <p className="text-emerald-100 text-sm mt-1">#{form.watch("estimateNumber")}</p>
            </div>
          </div>

          {/* Estimate Details */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Prepared For</p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="font-bold text-lg text-gray-900">{selectedCustomer?.name || "-"}</p>
                  {selectedCustomer?.company && <p className="text-gray-600 mt-1">{selectedCustomer.company}</p>}
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold text-gray-700">Estimate Number:</span>
                <span className="text-gray-900 font-medium">{form.watch("estimateNumber")}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold text-gray-700">Estimate Date:</span>
                <span className="text-gray-900">{format(form.watch("estimateDate"), "PPP")}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold text-gray-700">Expiry Date:</span>
                <span className="text-gray-900 font-medium">{format(form.watch("expiryDate"), "PPP")}</span>
              </div>
              {form.watch("reference") && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-semibold text-gray-700">Reference:</span>
                  <span className="text-gray-900">{form.watch("reference")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="mt-8">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-y-2 border-gray-300">
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Description</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-700 w-20">Qty</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-700 w-28">Rate</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-700 w-20">Tax %</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-700 w-32">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-900">{item.description || "-"}</td>
                    <td className="text-center py-4 px-4 text-gray-700">{item.quantity}</td>
                    <td className="text-right py-4 px-4 text-gray-700">GH₵ {item.rate.toFixed(2)}</td>
                    <td className="text-center py-4 px-4 text-gray-700">{item.taxRate}%</td>
                    <td className="text-right py-4 px-4 font-semibold text-gray-900">GH₵ {(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mt-8">
            <div className="w-80">
              <div className="space-y-3 bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between text-sm py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">GH₵ {calculateSubtotal().toFixed(2)}</span>
                </div>
                {calculateDiscount() > 0 && (
                  <div className="flex justify-between text-sm py-2">
                    <span className="text-red-600">Discount ({discountType === "percentage" ? `${discount}%` : "Fixed"}):</span>
                    <span className="font-semibold text-red-600">- GH₵ {calculateDiscount().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm py-2">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold text-gray-900">GH₵ {calculateTax().toFixed(2)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between py-3 bg-emerald-600 text-white px-4 rounded-lg">
                  <span className="text-lg font-bold">Total Amount:</span>
                  <span className="text-2xl font-bold">GH₵ {calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          {(form.watch("notes") || form.watch("terms")) && (
            <div className="mt-8 space-y-4">
              {form.watch("notes") && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-semibold text-blue-900 mb-2 text-sm">Customer Notes:</p>
                  <p className="text-blue-800 text-sm">{form.watch("notes")}</p>
                </div>
              )}
              {form.watch("terms") && (
                <div className="bg-gray-50 border border-gray-200 p-4 rounded">
                  <p className="font-semibold text-gray-900 mb-2 text-sm">Terms & Conditions:</p>
                  <p className="text-gray-700 text-xs leading-relaxed">{form.watch("terms")}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="print:block hidden mt-12 pt-8 border-t-2 border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 text-sm font-medium">Thank you for considering our services!</p>
              <p className="text-gray-500 text-xs mt-2">This estimate was generated by PayFlow - Professional Payroll & Accounting</p>
              <p className="text-gray-400 text-xs mt-1">For any queries, please contact us at info@payflow.com</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
