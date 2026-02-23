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
import { createLoan } from "@/lib/actions/loan.action";

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

const loanSchema = z.object({
  loanNumber: z.string().min(1, "Loan number is required"),
  loanName: z.string().min(1, "Loan name is required"),
  loanType: z.enum(["term", "line-of-credit", "mortgage", "other"]),
  lender: z.string().min(1, "Lender is required"),
  principalAmount: z.number().min(0.01, "Principal amount must be greater than 0"),
  interestRate: z.number().min(0, "Interest rate must be 0 or greater"),
  loanTerm: z.number().min(1, "Loan term must be at least 1 month"),
  startDate: z.date(),
  maturityDate: z.date(),
  paymentFrequency: z.enum(["monthly", "quarterly", "annually"]),
  paymentAmount: z.number().min(0, "Payment amount must be 0 or greater"),
  loanAccountId: z.string().optional(),
  cashAccountId: z.string().optional(),
  notes: z.string().optional(),
});

type LoanFormValues = z.infer<typeof loanSchema>;

export function LoanForm() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      loanNumber: `LOAN-${Date.now().toString().slice(-6)}`,
      loanName: "",
      loanType: "term",
      lender: "",
      principalAmount: 0,
      interestRate: 0,
      loanTerm: 12,
      startDate: new Date(),
      maturityDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      paymentFrequency: "monthly",
      paymentAmount: 0,
      loanAccountId: "",
      cashAccountId: "",
      notes: "",
    },
  });

  const principalAmount = form.watch("principalAmount");
  const interestRate = form.watch("interestRate");
  const loanTerm = form.watch("loanTerm");
  const paymentFrequency = form.watch("paymentFrequency");

  const monthlyRate = interestRate / 100 / 12;
  const estimatedPayment = monthlyRate > 0
    ? (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1)
    : principalAmount / loanTerm;

  const onSubmit = async (data: LoanFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createLoan(data);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Loan created successfully");
        router.push(`/${params.organizationId}/dashboard/${params.userId}/loans/all`);
      }
    } catch (error) {
      console.error("Error creating loan:", error);
      toast.error("Failed to create loan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Loans
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Information</CardTitle>
                <CardDescription>Enter the basic loan details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="loanNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Number *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="LOAN-001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="loanType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="term">Term Loan</SelectItem>
                            <SelectItem value="line-of-credit">Line of Credit</SelectItem>
                            <SelectItem value="mortgage">Mortgage</SelectItem>
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
                  name="loanName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Business Expansion Loan" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lender *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., ABC Bank" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="principalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Principal Amount (GHS) *</FormLabel>
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
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interest Rate (%) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>Annual interest rate</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="loanTerm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Term (Months) *</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="paymentFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Frequency *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
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
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date *</FormLabel>
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
                    name="maturityDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Maturity Date *</FormLabel>
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

                <FormField
                  control={form.control}
                  name="paymentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Amount (GHS) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Estimated: GHS {estimatedPayment.toFixed(2)} per month
                      </FormDescription>
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
                  name="loanAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Liability Account</FormLabel>
                      <FormControl>
                        <AccountSelector
                          label=""
                          accountType="liability"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Default: Loans Payable"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cashAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cash Account</FormLabel>
                      <FormControl>
                        <AccountSelector
                          label=""
                          accountType="asset"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Default: Cash"
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
                <CardTitle>Loan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Principal</span>
                    <span className="font-medium">GHS {principalAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Interest Rate</span>
                    <span className="font-medium">{interestRate}%</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Term</span>
                    <span className="font-medium">{loanTerm} months</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Monthly Payment</span>
                    <span className="font-medium text-red-600">
                      GHS {estimatedPayment.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Interest</span>
                    <span className="font-medium">
                      GHS {((estimatedPayment * loanTerm) - principalAmount).toFixed(2)}
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
                    {isSubmitting ? "Saving..." : "Save Loan"}
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
