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
import { Textarea } from "@/components/ui/textarea";
import { createVATFiling } from "@/lib/actions/vat-filing.action";
import { toast } from "sonner";

const formSchema = z.object({
  filingPeriod: z.string().min(1, "Filing period is required"),
  filingMonth: z.string().min(1, "Filing month is required"),
  vatAmount: z.string().min(1, "VAT amount is required"),
  filedDate: z.string().min(1, "Filed date is required"),
  status: z.enum(["filed", "paid", "overdue"]),
  graReferenceNumber: z.string().optional(),
  notes: z.string().optional(),
});

interface RecordVATFilingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentVATPayable: number;
}

export function RecordVATFilingDialog({
  open,
  onOpenChange,
  currentVATPayable,
}: RecordVATFilingDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filingPeriod: "",
      filingMonth: "",
      vatAmount: currentVATPayable.toString(),
      filedDate: new Date().toISOString().split("T")[0],
      status: "filed",
      graReferenceNumber: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const result = await createVATFiling({
        ...values,
        vatAmount: parseFloat(values.vatAmount),
        filedDate: new Date(values.filedDate),
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("VAT filing recorded successfully");
        form.reset();
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to record VAT filing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Record VAT Filing</DialogTitle>
          <DialogDescription>
            Record a VAT return filed with Ghana Revenue Authority
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="filingPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period (YYYY-MM)</FormLabel>
                    <FormControl>
                      <Input placeholder="2024-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filingMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <FormControl>
                      <Input placeholder="January 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vatAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT Amount (GHS)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filed Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="filed">Filed (Not Paid)</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="graReferenceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GRA Reference Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="GRA-2024-XXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Recording..." : "Record Filing"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
