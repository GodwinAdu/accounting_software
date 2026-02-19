"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { createBankReconciliation } from "@/lib/actions/bank-reconciliation.action";
import { toast } from "sonner";

const formSchema = z.object({
  bankAccountId: z.string().min(1, "Bank account is required"),
  statementDate: z.string().min(1, "Statement date is required"),
  statementBalance: z.string().min(1, "Statement balance is required"),
});

interface StartReconciliationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: any[];
}

export function StartReconciliationDialog({ open, onOpenChange, accounts }: StartReconciliationDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankAccountId: "",
      statementDate: new Date().toISOString().split("T")[0],
      statementBalance: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const result = await createBankReconciliation({
        ...values,
        statementBalance: parseFloat(values.statementBalance),
        statementDate: new Date(values.statementDate),
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Reconciliation started successfully");
        form.reset();
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to start reconciliation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Start Bank Reconciliation</DialogTitle>
          <DialogDescription>
            Enter your bank statement details to begin reconciliation
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bankAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account._id} value={account._id}>
                          {account.bankName} - {account.accountName}
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
              name="statementDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statement Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statementBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statement Ending Balance (GHS)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                {loading ? "Starting..." : "Start Reconciliation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
