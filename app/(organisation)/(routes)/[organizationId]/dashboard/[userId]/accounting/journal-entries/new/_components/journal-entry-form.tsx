"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Save, CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const journalEntrySchema = z.object({
  reference: z.string().min(1, "Reference is required"),
  date: z.date(),
  description: z.string().min(1, "Description is required"),
  lines: z.array(z.object({
    account: z.string().min(1, "Account is required"),
    description: z.string().optional(),
    debit: z.number().min(0),
    credit: z.number().min(0),
  })).min(2, "At least 2 lines required"),
  notes: z.string().optional(),
});

type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;

const mockAccounts = [
  { code: "1000", name: "Cash" },
  { code: "1100", name: "Accounts Receivable" },
  { code: "1500", name: "Equipment" },
  { code: "2000", name: "Accounts Payable" },
  { code: "3000", name: "Owner's Equity" },
  { code: "4000", name: "Sales Revenue" },
  { code: "5000", name: "Cost of Goods Sold" },
  { code: "5100", name: "Salaries Expense" },
];

export function JournalEntryForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JournalEntryFormValues>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      reference: `JE-${Date.now().toString().slice(-6)}`,
      date: new Date(),
      description: "",
      lines: [
        { account: "", description: "", debit: 0, credit: 0 },
        { account: "", description: "", debit: 0, credit: 0 },
      ],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  const lines = form.watch("lines");
  const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const onSubmit = async (data: JournalEntryFormValues) => {
    if (!isBalanced) {
      alert("Debits and credits must be equal!");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Journal entry data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("../");
    } catch (error) {
      console.error("Error creating journal entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Journal Entries
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Entry Information</CardTitle>
                <CardDescription>Basic journal entry details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date *</FormLabel>
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

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Brief description of the entry" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Journal Lines</CardTitle>
                <CardDescription>Enter debits and credits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Line {index + 1}</h4>
                      {fields.length > 2 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={`lines.${index}.account`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select account" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockAccounts.map((account) => (
                                <SelectItem key={account.code} value={account.code}>
                                  {account.code} - {account.name}
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
                      name={`lines.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Line Description</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Optional line description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`lines.${index}.debit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Debit (GHS)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`lines.${index}.credit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Credit (GHS)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                placeholder="0.00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ account: "", description: "", debit: 0, credit: 0 })}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line
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
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Entry Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Debits</span>
                    <span className="font-medium text-emerald-600">GHS {totalDebit.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Credits</span>
                    <span className="font-medium text-blue-600">GHS {totalCredit.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Difference</span>
                    <span className={cn("font-medium", isBalanced ? "text-emerald-600" : "text-red-600")}>
                      GHS {Math.abs(totalDebit - totalCredit).toFixed(2)}
                    </span>
                  </div>

                  {!isBalanced && totalDebit + totalCredit > 0 && (
                    <p className="text-xs text-red-600 mt-2">
                      Entry is not balanced. Debits must equal credits.
                    </p>
                  )}

                  {isBalanced && (
                    <p className="text-xs text-emerald-600 mt-2">
                      ✓ Entry is balanced
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting || !isBalanced}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save as Draft"}
                  </Button>

                  <Button
                    type="button"
                    className="w-full"
                    disabled={isSubmitting || !isBalanced}
                  >
                    Post Entry
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
