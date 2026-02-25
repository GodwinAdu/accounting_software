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
import { updateEquityTransaction } from "@/lib/actions/equity-transaction.action";

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

const equitySchema = z.object({
  transactionType: z.enum(["investment", "drawing", "dividend"]),
  transactionDate: z.date(),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  ownerName: z.string().min(1, "Owner name is required"),
  description: z.string().min(1, "Description is required"),
  equityAccountId: z.string().min(1, "Equity account is required"),
  cashAccountId: z.string().min(1, "Cash account is required"),
});

type EquityFormValues = z.infer<typeof equitySchema>;

interface EditEquityFormProps {
  transaction: any;
}

export function EditEquityForm({ transaction }: EditEquityFormProps) {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EquityFormValues>({
    resolver: zodResolver(equitySchema),
    defaultValues: {
      transactionType: transaction.transactionType,
      transactionDate: new Date(transaction.transactionDate),
      amount: transaction.amount,
      ownerName: transaction.ownerName,
      description: transaction.description,
      equityAccountId: transaction.equityAccountId?.toString() || "",
      cashAccountId: transaction.cashAccountId?.toString() || "",
    },
  });

  const transactionType = form.watch("transactionType");
  const amount = form.watch("amount");

  const onSubmit = async (data: EquityFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateEquityTransaction(transaction._id, data);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Transaction updated successfully");
        router.push(`/${params.organizationId}/dashboard/${params.userId}/equity/all`);
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast.error("Failed to update transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Edit Transaction</h2>
            <p className="text-muted-foreground">Transaction #{transaction.transactionNumber}</p>
          </div>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Information</CardTitle>
                <CardDescription>Update the equity transaction details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="transactionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="investment">Investment</SelectItem>
                            <SelectItem value="drawing">Drawing</SelectItem>
                            <SelectItem value="dividend">Dividend</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {transactionType === "investment" && "Owner contributes capital"}
                          {transactionType === "drawing" && "Owner withdraws funds"}
                          {transactionType === "dividend" && "Profit distribution to owners"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="transactionDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Transaction Date *</FormLabel>
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
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., John Doe" />
                      </FormControl>
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

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief description of the transaction..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Selection</CardTitle>
                <CardDescription>Select the accounts for this transaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="equityAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equity Account *</FormLabel>
                      <FormControl>
                        <AccountSelector
                          label=""
                          accountType="equity"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Select equity account"
                        />
                      </FormControl>
                      <FormDescription>
                        Owner's Equity, Retained Earnings, or Capital account
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cashAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cash Account *</FormLabel>
                      <FormControl>
                        <AccountSelector
                          label=""
                          accountType="asset"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Select cash account"
                        />
                      </FormControl>
                      <FormDescription>
                        Cash or Bank account for the transaction
                      </FormDescription>
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
                <CardTitle>Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">{transactionType}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">GHS {amount.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Impact on Equity</span>
                    <span className={transactionType === "investment" ? "text-emerald-600" : "text-red-600"}>
                      {transactionType === "investment" ? "+" : "-"}GHS {amount.toFixed(2)}
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
                    {isSubmitting ? "Updating..." : "Update Transaction"}
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
