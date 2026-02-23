"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createFixedAsset } from "@/lib/actions/fixed-asset.action";

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
import { AccountSelector } from "@/components/forms/account-selector";

const assetSchema = z.object({
  assetNumber: z.string().min(1, "Asset number is required"),
  assetName: z.string().min(1, "Asset name is required"),
  assetType: z.enum(["property", "equipment", "vehicle", "furniture", "other"]),
  purchaseDate: z.date(),
  purchasePrice: z.number().min(0.01, "Purchase price must be greater than 0"),
  salvageValue: z.number().min(0).default(0),
  usefulLife: z.number().min(1, "Useful life must be at least 1 year"),
  depreciationMethod: z.enum(["straight-line", "declining-balance"]),
  assetAccountId: z.string().optional(),
  depreciationAccountId: z.string().optional(),
  location: z.string().optional(),
  serialNumber: z.string().optional(),
  notes: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

export function AssetForm() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      assetNumber: `AST-${Date.now().toString().slice(-6)}`,
      assetName: "",
      assetType: "equipment",
      purchaseDate: new Date(),
      purchasePrice: 0,
      salvageValue: 0,
      usefulLife: 5,
      depreciationMethod: "straight-line",
      assetAccountId: "",
      depreciationAccountId: "",
      location: "",
      serialNumber: "",
      notes: "",
    },
  });

  const purchasePrice = form.watch("purchasePrice");
  const salvageValue = form.watch("salvageValue");
  const usefulLife = form.watch("usefulLife");
  const depreciationMethod = form.watch("depreciationMethod");

  const annualDepreciation = depreciationMethod === "straight-line"
    ? (purchasePrice - salvageValue) / usefulLife
    : purchasePrice * 0.2;

  const onSubmit = async (data: AssetFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createFixedAsset(data);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Fixed asset created successfully");
        router.push(`/${params.organizationId}/dashboard/${params.userId}/assets/all`);
      }
    } catch (error) {
      console.error("Error creating asset:", error);
      toast.error("Failed to create asset");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assets
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asset Information</CardTitle>
                <CardDescription>Enter the basic asset details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="assetNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="AST-001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assetType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="property">Property</SelectItem>
                            <SelectItem value="equipment">Equipment</SelectItem>
                            <SelectItem value="vehicle">Vehicle</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="assetName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Dell Laptop, Toyota Camry" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serial Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Optional" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Main Office" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="purchaseDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Purchase Date *</FormLabel>
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="purchasePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Price (GHS) *</FormLabel>
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
                    name="salvageValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salvage Value (GHS)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>Estimated value at end of life</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Depreciation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="depreciationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Depreciation Method *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="straight-line">Straight Line</SelectItem>
                            <SelectItem value="declining-balance">Declining Balance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usefulLife"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Useful Life (Years) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Estimated Annual Depreciation</p>
                  <p className="text-2xl font-bold text-red-600">
                    GHS {annualDepreciation.toFixed(2)}
                  </p>
                </div>
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
                  name="assetAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Account</FormLabel>
                      <FormControl>
                        <AccountSelector
                          label=""
                          accountType="asset"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Default: Fixed Assets"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depreciationAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depreciation Expense Account</FormLabel>
                      <FormControl>
                        <AccountSelector
                          label=""
                          accountType="expense"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Default: Depreciation Expense"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
                        <Textarea
                          {...field}
                          placeholder="Add any additional notes..."
                          rows={4}
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
                <CardTitle>Asset Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Purchase Price</span>
                    <span className="font-medium">GHS {purchasePrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Salvage Value</span>
                    <span className="font-medium">GHS {salvageValue.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Useful Life</span>
                    <span className="font-medium">{usefulLife} years</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Annual Depreciation</span>
                    <span className="font-medium text-red-600">
                      GHS {annualDepreciation.toFixed(2)}
                    </span>
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
                    {isSubmitting ? "Saving..." : "Save Asset"}
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
