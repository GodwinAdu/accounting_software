"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, CalendarIcon, Plus, Trash2, Package, Receipt } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VendorCombobox } from "../../../all/new/_components/vendor-combobox";
import { AccountSelector } from "@/components/forms/account-selector";
import { getVendors } from "@/lib/actions/vendor.action";
import { getProducts } from "@/lib/actions/product.action";
import { createPurchaseOrder } from "@/lib/actions/purchase-order.action";

const purchaseOrderSchema = z.object({
  poNumber: z.string().min(1, "PO number is required"),
  vendorId: z.string().min(1, "Vendor is required"),
  orderDate: z.date(),
  deliveryDate: z.date(),
  items: z.array(z.object({
    type: z.enum(["product", "expense"]),
    productId: z.string().optional(),
    expenseAccountId: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    amount: z.number(),
  })).min(1, "At least one item is required"),
  notes: z.string().optional(),
  inventoryAccountId: z.string().optional(),
  payableAccountId: z.string().optional(),
});

type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;

export function PurchaseOrderForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      poNumber: `PO-${Date.now().toString().slice(-6)}`,
      vendorId: "",
      orderDate: new Date(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      items: [{ type: "product", productId: "", expenseAccountId: "", description: "", quantity: 1, unitPrice: 0, amount: 0 }],
      notes: "",
      inventoryAccountId: "",
      payableAccountId: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = form.watch("items");
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  useEffect(() => {
    loadVendors();
    loadProducts();
  }, []);

  const loadVendors = async () => {
    try {
      const result = await getVendors();
      if (result.success && result.data) {
        setVendors(result.data.map((v: any) => ({ id: v._id, name: v.companyName })));
      }
    } catch (error) {
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const result = await getProducts();
      if (result.success && result.data) {
        setProducts(result.data.filter((p: any) => p.status === "active"));
      } else {
        console.error("Failed to load products:", result.error);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      form.setValue(`items.${index}.productId`, productId);
      form.setValue(`items.${index}.description`, product.name);
      form.setValue(`items.${index}.unitPrice`, product.costPrice || product.sellingPrice);
      const qty = form.getValues(`items.${index}.quantity`);
      form.setValue(`items.${index}.amount`, qty * (product.costPrice || product.sellingPrice));
    }
  };

  const calculateAmount = (index: number) => {
    const item = items[index];
    const amount = item.quantity * item.unitPrice;
    form.setValue(`items.${index}.amount`, amount);
  };

  const onSubmit = async (data: PurchaseOrderFormValues) => {
    setIsSubmitting(true);
    try {
      const poData: any = {
        poNumber: data.poNumber,
        vendorId: data.vendorId,
        orderDate: data.orderDate,
        deliveryDate: data.deliveryDate,
        items: data.items,
        notes: data.notes,
        subtotal: subtotal,
        total: subtotal,
        status: "draft",
      };

      if (data.inventoryAccountId) poData.inventoryAccountId = data.inventoryAccountId;
      if (data.payableAccountId) poData.payableAccountId = data.payableAccountId;

      const result = await createPurchaseOrder(poData, window.location.pathname);
      
      if (result.error) {
        toast.error("Failed to create purchase order", { description: result.error });
        return;
      }

      toast.success("Purchase order created successfully");
      router.push("../");
    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast.error("Failed to create purchase order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Purchase Orders
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Order Information</CardTitle>
                <CardDescription>Enter purchase order details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="poNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PO Number *</FormLabel>
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
                    name="orderDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Order Date *</FormLabel>
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
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expected Delivery *</FormLabel>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => {
                  const itemType = form.watch(`items.${index}.type`);
                  return (
                  <div key={field.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        <Badge variant={itemType === "product" ? "default" : "secondary"}>
                          {itemType === "product" ? <Package className="h-3 w-3 mr-1" /> : <Receipt className="h-3 w-3 mr-1" />}
                          {itemType === "product" ? "Product" : "Expense"}
                        </Badge>
                      </div>
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`items.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="product">Product (Inventory)</SelectItem>
                              <SelectItem value="expense">Expense (Non-Inventory)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {itemType === "product" && (
                      <FormField
                        control={form.control}
                        name={`items.${index}.productId`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Product *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                  >
                                    {field.value
                                      ? products.find((p) => p._id === field.value)?.name
                                      : "Select product"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[400px] p-0">
                                <Command>
                                  <CommandInput placeholder="Search product..." />
                                  <CommandList>
                                    <CommandEmpty>No product found.</CommandEmpty>
                                    <CommandGroup>
                                      {products.map((prod) => (
                                        <CommandItem
                                          key={prod._id}
                                          value={`${prod.name} ${prod.sku}`}
                                          onSelect={() => handleProductChange(index, prod._id)}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              prod._id === field.value ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          <div className="flex items-center justify-between w-full">
                                            <span>{prod.name}</span>
                                            <Badge variant="outline" className="ml-2">
                                              Stock: {prod.currentStock}
                                            </Badge>
                                          </div>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {itemType === "expense" && (
                      <FormField
                        control={form.control}
                        name={`items.${index}.expenseAccountId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expense Account</FormLabel>
                            <FormControl>
                              <AccountSelector
                                label=""
                                accountType="expense"
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Default: Purchases"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

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
                  );
                })}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ type: "product", productId: "", expenseAccountId: "", description: "", quantity: 1, unitPrice: 0, amount: 0 })}
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
                
                <FormField
                  control={form.control}
                  name="inventoryAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inventory Account</FormLabel>
                      <FormControl>
                        <AccountSelector
                          label=""
                          accountType="asset"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Default: Inventory"
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
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
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
                    <span className="text-emerald-600">GHS {subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Create Purchase Order"}
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
