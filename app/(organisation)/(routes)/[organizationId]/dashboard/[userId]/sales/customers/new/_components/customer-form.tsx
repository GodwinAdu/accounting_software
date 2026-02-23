"use client";

import { useState } from "react";
import { createCustomer, updateCustomer } from "@/lib/actions/customer.action";
import { useParams, usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, User, MapPin, CreditCard, FileText } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const customerSchema = z.object({
  // Basic Information
  customerType: z.enum(["individual", "business"]),
  name: z.string().min(2, "Name is required"),
  companyName: z.string().optional(),
  displayName: z.string().min(2, "Display name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  mobile: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  
  // Billing Address
  billingAttention: z.string().optional(),
  billingStreet: z.string().min(1, "Billing address is required"),
  billingCity: z.string().min(1, "City is required"),
  billingState: z.string().optional(),
  billingZipCode: z.string().optional(),
  billingCountry: z.string().default("Ghana"),
  
  // Shipping Address
  sameAsBilling: z.boolean().default(true),
  shippingAttention: z.string().optional(),
  shippingStreet: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingZipCode: z.string().optional(),
  shippingCountry: z.string().optional(),
  
  // Financial Details
  taxId: z.string().optional(),
  currency: z.string().default("GHS"),
  paymentTerms: z.string().default("net-30"),
  creditLimit: z.number().min(0).optional(),
  openingBalance: z.number().default(0),
  
  // Additional Details
  notes: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const ghanaRegions = [
  "Greater Accra", "Ashanti", "Western", "Eastern", "Central",
  "Northern", "Upper East", "Upper West", "Volta", "Bono",
  "Bono East", "Ahafo", "Savannah", "North East", "Oti", "Western North"
];

type CustomerFormProps = {
  initialData?: any;
};

export function CustomerForm({ initialData }: CustomerFormProps) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData;

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData ? {
      customerType: initialData.customerType || "business",
      name: initialData.name || "",
      companyName: initialData.company || "",
      displayName: initialData.name || "",
      email: initialData.email || "",
      phone: initialData.phone || "",
      mobile: initialData.mobile || "",
      website: initialData.website || "",
      billingAttention: initialData.address?.attention || "",
      billingStreet: initialData.address?.street || "",
      billingCity: initialData.address?.city || "",
      billingState: initialData.address?.state || "",
      billingZipCode: initialData.address?.postalCode || "",
      billingCountry: initialData.address?.country || "Ghana",
      sameAsBilling: true,
      shippingAttention: "",
      shippingStreet: "",
      shippingCity: "",
      shippingState: "",
      shippingZipCode: "",
      shippingCountry: "Ghana",
      taxId: initialData.taxId || "",
      currency: initialData.currency || "GHS",
      paymentTerms: initialData.paymentTerms || "net-30",
      creditLimit: initialData.creditLimit || 0,
      openingBalance: initialData.openingBalance || 0,
      notes: initialData.notes || "",
      tags: initialData.tags || "",
      status: initialData.status || "active",
    } : {
      customerType: "business",
      name: "",
      companyName: "",
      displayName: "",
      email: "",
      phone: "",
      mobile: "",
      website: "",
      billingAttention: "",
      billingStreet: "",
      billingCity: "",
      billingState: "",
      billingZipCode: "",
      billingCountry: "Ghana",
      sameAsBilling: true,
      shippingAttention: "",
      shippingStreet: "",
      shippingCity: "",
      shippingState: "",
      shippingZipCode: "",
      shippingCountry: "Ghana",
      taxId: "",
      currency: "GHS",
      paymentTerms: "net-30",
      creditLimit: 0,
      openingBalance: 0,
      notes: "",
      tags: "",
      status: "active",
    },
  });

  const customerType = form.watch("customerType");
  const sameAsBilling = form.watch("sameAsBilling");

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      const customerData: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.companyName,
        mobile: data.mobile,
        website: data.website,
        address: {
          attention: data.billingAttention,
          street: data.billingStreet,
          city: data.billingCity,
          state: data.billingState,
          country: data.billingCountry,
          postalCode: data.billingZipCode,
        },
        shippingAddress: data.sameAsBilling ? undefined : {
          attention: data.shippingAttention,
          street: data.shippingStreet,
          city: data.shippingCity,
          state: data.shippingState,
          country: data.shippingCountry,
          postalCode: data.shippingZipCode,
        },
        taxId: data.taxId,
        currency: data.currency,
        paymentTerms: data.paymentTerms,
        creditLimit: data.creditLimit,
        openingBalance: data.openingBalance,
        notes: data.notes,
        tags: data.tags,
        status: data.status,
      };

      const result = isEditMode
        ? await updateCustomer(initialData._id, customerData, pathname)
        : await createCustomer(customerData, pathname);

      if (result.error) {
        console.error(result.error);
      } else {
        router.push(`/${params.organizationId}/dashboard/${params.userId}/sales/customers`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} customer:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">
              <User className="h-4 w-4 mr-2" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="billing">
              <MapPin className="h-4 w-4 mr-2" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="financial">
              <CreditCard className="h-4 w-4 mr-2" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="additional">
              <FileText className="h-4 w-4 mr-2" />
              Additional
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Enter the basic details of your customer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {customerType === "business" && (
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Kwame Mensah" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="How this customer appears in transactions" {...field} />
                      </FormControl>
                      <FormDescription>
                        This name will appear on invoices and reports
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="kwame@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input placeholder="+233 24 123 4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile</FormLabel>
                        <FormControl>
                          <Input placeholder="+233 20 987 6543" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>
                  Enter the billing address for invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="billingAttention"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attention</FormLabel>
                      <FormControl>
                        <Input placeholder="Accounts Department" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingStreet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="123 Main Street" {...field} rows={2} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billingCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Accra" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billingState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ghanaRegions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
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
                    name="billingZipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="GA-123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billingCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Ghana">Ghana</SelectItem>
                            <SelectItem value="Nigeria">Nigeria</SelectItem>
                            <SelectItem value="Kenya">Kenya</SelectItem>
                            <SelectItem value="South Africa">South Africa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>
                  Enter the shipping address for deliveries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="sameAsBilling"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Same as Billing Address</FormLabel>
                        <FormDescription>
                          Use the billing address for shipping
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!sameAsBilling && (
                  <>
                    <FormField
                      control={form.control}
                      name="shippingAttention"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Attention</FormLabel>
                          <FormControl>
                            <Input placeholder="Warehouse Manager" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shippingStreet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="456 Delivery Lane" {...field} rows={2} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shippingCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Kumasi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shippingState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ghanaRegions.map((region) => (
                                  <SelectItem key={region} value={region}>
                                    {region}
                                  </SelectItem>
                                ))}
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
                        name="shippingZipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="AK-123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shippingCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Ghana">Ghana</SelectItem>
                                <SelectItem value="Nigeria">Nigeria</SelectItem>
                                <SelectItem value="Kenya">Kenya</SelectItem>
                                <SelectItem value="South Africa">South Africa</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
                <CardDescription>
                  Set up payment terms and financial details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID / TIN</FormLabel>
                        <FormControl>
                          <Input placeholder="C0000000000" {...field} />
                        </FormControl>
                        <FormDescription>
                          Ghana Revenue Authority TIN
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="GHS">GHS - Ghana Cedi</SelectItem>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                          <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                          <SelectItem value="net-15">Net 15</SelectItem>
                          <SelectItem value="net-30">Net 30</SelectItem>
                          <SelectItem value="net-45">Net 45</SelectItem>
                          <SelectItem value="net-60">Net 60</SelectItem>
                          <SelectItem value="net-90">Net 90</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Default payment terms for this customer
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="creditLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credit Limit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum credit allowed (GHS)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="openingBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Balance</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Initial balance (GHS)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Additional Tab */}
          <TabsContent value="additional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Add notes and other details about this customer
                </CardDescription>
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
                          placeholder="Add any internal notes about this customer..."
                          {...field}
                          rows={5}
                        />
                      </FormControl>
                      <FormDescription>
                        These notes are for internal use only
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="VIP, Wholesale, Retail (comma separated)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Add tags to organize and filter customers
                      </FormDescription>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Inactive customers won't appear in dropdowns
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 sticky bottom-0 bg-background py-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Saving..." : isEditMode ? "Update Customer" : "Save Customer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
