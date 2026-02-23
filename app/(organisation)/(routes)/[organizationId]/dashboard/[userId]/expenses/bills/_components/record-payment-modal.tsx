"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { recordBillPayment } from "@/lib/actions/bill.action";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

const paymentSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentDate: z.string().min(1, "Payment date is required"),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface RecordPaymentModalProps {
  bill: {
    _id: string;
    billNumber: string;
    balance: number;
  };
  open: boolean;
  onClose: () => void;
}

export function RecordPaymentModal({ bill, open, onClose }: RecordPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: bill.balance,
      paymentDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: PaymentFormValues) => {
    if (data.amount > bill.balance) {
      toast.error("Payment amount cannot exceed balance");
      return;
    }

    setLoading(true);
    const result = await recordBillPayment(bill._id, data.amount, data.paymentDate, pathname);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Payment recorded successfully");
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment - {bill.billNumber}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Balance Due: <span className="font-semibold text-foreground">GHS {bill.balance.toLocaleString()}</span>
            </div>
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Recording..." : "Record Payment"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
