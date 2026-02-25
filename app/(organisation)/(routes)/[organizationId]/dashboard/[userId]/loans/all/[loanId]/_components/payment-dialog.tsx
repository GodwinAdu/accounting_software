"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { processLoanPayment } from "@/lib/actions/loan.action";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AccountSelector } from "@/components/forms/account-selector";

const paymentSchema = z.object({
  paymentAmount: z.number().min(0.01, "Amount must be greater than 0"),
  paymentDate: z.date(),
  cashAccountId: z.string().min(1, "Cash account is required"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentDialogProps {
  loan: any;
  organizationId: string;
  userId: string;
}

export function PaymentDialog({ loan, organizationId, userId }: PaymentDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const monthlyRate = loan.interestRate / 100 / 12;
  const interestPayment = loan.outstandingBalance * monthlyRate;
  const principalPayment = loan.paymentAmount - interestPayment;

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentAmount: loan.paymentAmount,
      paymentDate: new Date(),
      cashAccountId: "",
    },
  });

  const watchedAmount = form.watch("paymentAmount");
  const calculatedInterest = loan.outstandingBalance * monthlyRate;
  const calculatedPrincipal = watchedAmount - calculatedInterest;

  const onSubmit = async (data: PaymentFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await processLoanPayment(
        loan._id,
        data.paymentAmount,
        data.paymentDate,
        data.cashAccountId
      );

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Payment processed successfully");
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <DollarSign className="h-4 w-4 mr-2" />
          Make Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Process Loan Payment</DialogTitle>
          <DialogDescription>
            Record a payment for {loan.loanName} - {loan.loanNumber}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    Scheduled payment: GHS {loan.paymentAmount.toFixed(2)}
                  </FormDescription>
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
              name="cashAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cash Account *</FormLabel>
                  <FormControl>
                    <AccountSelector
                      label=""
                      accountType="asset"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select cash/bank account"
                    />
                  </FormControl>
                  <FormDescription>
                    Account to debit for this payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-slate-50 border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Payment Breakdown</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Principal:</span>
                  <span className="font-medium text-emerald-600">
                    GHS {Math.max(0, calculatedPrincipal).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest:</span>
                  <span className="font-medium text-orange-600">
                    GHS {calculatedInterest.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Total Payment:</span>
                  <span className="font-bold">GHS {watchedAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New Balance:</span>
                  <span className="font-medium">
                    GHS {Math.max(0, loan.outstandingBalance - calculatedPrincipal).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Process Payment"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
