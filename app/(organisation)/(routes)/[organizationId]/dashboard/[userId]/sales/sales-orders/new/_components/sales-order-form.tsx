"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, Plus, Trash2, Package } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";

import { createSalesOrder } from "@/lib/actions/sales-order.action";
import { getCustomers, createCustomer } from "@/lib/actions/customer.action";
import { getProducts, createProduct } from "@/lib/actions/product.action";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { AccountSelector } from "@/components/forms/account-selector";

const lineItemSchema = z.object({
  productId: z.string().min(1, "Product required"),
  description: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  amount: z.number(),
});

const salesOrderSchema = z.object({
  customerId: z.string().min(1, "Customer required"),
  orderNumber: z.string().optional(),
  orderDate: z.date(),
  deliveryDate: z.date().optional(),
  items: z.array(lineItemSchema).min(1, "At least one item required"),
  discount: z.number().min(0),
  notes: z.string().optional(),
  revenueAccountId: z.string().optional(),
  receivableAccountId: z.string().optional(),
  taxAccountId: z.string().optional(),
});

type SalesOrderFormValues = z.infer<typeof salesOrderSchema>;

export function SalesOrderForm() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "", company: "" });
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", sellingPrice: 0, costPrice: 0, currentStock: 0 });

  const form = useForm<SalesOrderFormValues>({
    resolver: zodResolver(salesOrderSchema),
    defaultValues: {
      customerId: "",
      orderNumber: `SO-${Date.now().toString().slice(-6)}`,
      orderDate: new Date(),
      deliveryDate: undefined,
      items: [{ productId: "", description: "", quantity: 1, unitPrice: 0, amount: 0 }],
      discount: 0,
      notes: "",
      revenueAccountId: "",
      receivableAccountId: "",
      taxAccountId: "",
    },
  });

  const fetchCustomers = async () => {
    const result = await getCustomers();
    if (result.success) setCustomers(result.data);
  };

  const fetchProducts = async () => {
    const result = await getProducts();
    if (result.success) setProducts(result.data.filter((p: any) => p.status === "active"));
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const items = form.watch("items");
  const discount = form.watch("discount");

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return items.reduce((sum, item) => {
      const product = products.find(p => p._id === item.productId);
      if (product?.taxable && product?.taxRate) {
        return sum + (item.amount * product.taxRate / 100);
      }
      return sum;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - discount + calculateTax();
  };

  const addLineItem = () => {
    form.setValue("items", [
      ...items,
      { productId: "", description: "", quantity: 1, unitPrice: 0, amount: 0 },
    ]);
  };

  const removeLineItem = (index: number) => {
    if (items.length > 1) {
      form.setValue("items", items.filter((_, i) => i !== index));
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      form.setValue(`items.${index}.productId`, productId);
      form.setValue(`items.${index}.description`, product.name);
      form.setValue(`items.${index}.unitPrice`, product.sellingPrice);
      const qty = form.getValues(`items.${index}.quantity`);
      form.setValue(`items.${index}.amount`, qty * product.sellingPrice);
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast.error("Name and email are required");
      return;
    }
    const result = await createCustomer(newCustomer, pathname);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Customer created");
      setShowCustomerDialog(false);
      setNewCustomer({ name: "", email: "", phone: "", company: "" });
      await fetchCustomers();
      form.setValue("customerId", result.data._id);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.sku) {
      toast.error("Name and SKU are required");
      return;
    }
    const productData = {
      ...newProduct,
      unit: "pcs",
      reorderLevel: 20,
      taxable: true,
      trackInventory: true,
      type: "product",
      status: "active",
    };
    const result = await createProduct(productData, pathname);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Product created");
      setShowProductDialog(false);
      setNewProduct({ name: "", sku: "", sellingPrice: 0, costPrice: 0, currentStock: 0 });
      await fetchProducts();
    }
  };

  const onSubmit = async (data: SalesOrderFormValues) => {
    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        subtotal: calculateSubtotal(),
        taxAmount: calculateTax(),
        total: calculateTotal(),
        status: "draft",
      };

      const result = await createSalesOrder(orderData, pathname);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Sales order created");
        router.push(`/${params.organizationId}/dashboard/${params.userId}/sales/sales-orders`);
      }
    } catch (error) {
      toast.error("Failed to create sales order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Order"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Customer *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                              >
                                {field.value
                                  ? customers.find((c) => c._id === field.value)?.name +
                                    (customers.find((c) => c._id === field.value)?.company
                                      ? ` (${customers.find((c) => c._id === field.value)?.company})`
                                      : "")
                                  : "Select customer"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[400px] p-0">
                            <Command>
                              <CommandInput placeholder="Search customer..." />
                              <CommandList>
                                <CommandEmpty>No customer found.</CommandEmpty>
                                <CommandGroup>
                                  {customers.map((customer) => (
                                    <CommandItem
                                      key={customer._id}
                                      value={`${customer.name} ${customer.company || ""}`}
                                      onSelect={() => {
                                        form.setValue("customerId", customer._id);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          customer._id === field.value ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {customer.name} {customer.company && `(${customer.company})`}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                              <div className="border-t p-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => setShowCustomerDialog(true)}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Create New Customer
                                </Button>
                              </div>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orderDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              >
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
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => {
                    const product = products.find(p => p._id === item.productId);
                    return (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 grid grid-cols-12 gap-3">
                            <div className="col-span-5">
                              <FormField
                                control={form.control}
                                name={`items.${index}.productId`}
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs">Product *</FormLabel>
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
                                          <div className="border-t p-2">
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              className="w-full"
                                              onClick={() => setShowProductDialog(true)}
                                            >
                                              <Plus className="h-4 w-4 mr-2" />
                                              Create New Product
                                            </Button>
                                          </div>
                                        </Command>
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              {product && product.currentStock < item.quantity && (
                                <p className="text-xs text-red-600 mt-1">
                                  Insufficient stock! Available: {product.currentStock}
                                </p>
                              )}
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
                                        {...field}
                                        onChange={(e) => {
                                          const value = parseInt(e.target.value) || 1;
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
                                    <FormLabel className="text-xs">Price</FormLabel>
                                    <FormControl>
                                      <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} disabled />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="col-span-2">
                              <div className="text-xs font-medium mb-2">Amount</div>
                              <div className="text-sm font-semibold pt-2">
                                GHS {item.amount.toFixed(2)}
                              </div>
                            </div>

                            <div className="col-span-1 flex items-end">
                              {items.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeLineItem(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>GL Accounts (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="revenueAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Revenue Account</FormLabel>
                      <AccountSelector
                        label=""
                        accountType="revenue"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Uses product sales account"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receivableAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Accounts Receivable</FormLabel>
                      <AccountSelector
                        label=""
                        accountType="asset"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Default: Accounts Receivable"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Account</FormLabel>
                      <AccountSelector
                        label=""
                        accountType="liability"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Default: VAT Payable"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Info</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} placeholder="Order notes..." />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (GHS)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">GHS {calculateSubtotal().toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-medium text-emerald-600">-GHS {discount.toFixed(2)}</span>
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
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
              </div>
              <div>
                <Label>Company</Label>
                <Input value={newCustomer.company} onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCustomerDialog(false)}>Cancel</Button>
              <Button type="button" onClick={handleCreateCustomer}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Product Name *</Label>
                <Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div>
                <Label>SKU *</Label>
                <Input value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Selling Price</Label>
                  <Input type="number" step="0.01" value={newProduct.sellingPrice} onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>Cost Price</Label>
                  <Input type="number" step="0.01" value={newProduct.costPrice} onChange={(e) => setNewProduct({ ...newProduct, costPrice: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <Label>Initial Stock</Label>
                <Input type="number" value={newProduct.currentStock} onChange={(e) => setNewProduct({ ...newProduct, currentStock: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowProductDialog(false)}>Cancel</Button>
              <Button type="button" onClick={handleCreateProduct}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
