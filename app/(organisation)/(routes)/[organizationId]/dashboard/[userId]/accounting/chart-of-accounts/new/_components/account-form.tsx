"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Info, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createAccount, updateAccount, getAccounts } from "@/lib/actions/account.action";
import { Alert, AlertDescription } from "@/components/ui/alert";

const accountSchema = z.object({
  accountCode: z.string().min(1, "Account code is required"),
  accountName: z.string().min(1, "Account name is required"),
  accountType: z.enum(["asset", "liability", "equity", "revenue", "expense"]),
  accountSubType: z.string().optional(),
  parentAccountId: z.string().optional(),
  level: z.number().default(0),
  isParent: z.boolean().default(false),
  description: z.string().optional(),
  currentBalance: z.number().default(0),
  isActive: z.boolean().default(true),
  allowManualJournal: z.boolean().default(true),
});

type AccountFormValues = z.infer<typeof accountSchema>;

const accountTypeOptions = [
  { value: "asset", label: "Asset" },
  { value: "liability", label: "Liability" },
  { value: "equity", label: "Equity" },
  { value: "revenue", label: "Revenue" },
  { value: "expense", label: "Expense" },
];

const subTypeOptions: Record<string, string[]> = {
  asset: [
    "Current Asset",
    "Cash & Cash Equivalents",
    "Bank",
    "Accounts Receivable",
    "Inventory",
    "Prepaid Expenses",
    "Other Current Assets",
    "Fixed Asset",
    "Property, Plant & Equipment",
    "Vehicles",
    "Furniture & Fixtures",
    "Accumulated Depreciation",
    "Intangible Assets",
    "Investments",
    "Other Assets",
  ],
  liability: [
    "Current Liability",
    "Accounts Payable",
    "Short-term Loan",
    "Credit Card",
    "Accrued Expenses",
    "Payroll Liabilities",
    "Sales Tax Payable",
    "Income Tax Payable",
    "Deferred Revenue",
    "Other Current Liabilities",
    "Long-term Liability",
    "Notes Payable",
    "Mortgage Payable",
    "Other Long-term Liabilities",
  ],
  equity: [
    "Owner's Equity",
    "Capital",
    "Retained Earnings",
    "Drawings/Dividends",
    "Common Stock",
    "Preferred Stock",
    "Treasury Stock",
    "Additional Paid-in Capital",
  ],
  revenue: [
    "Operating Revenue",
    "Sales Revenue",
    "Service Revenue",
    "Product Sales",
    "Consulting Revenue",
    "Subscription Revenue",
    "Other Income",
    "Interest Income",
    "Dividend Income",
    "Gain on Sale of Assets",
  ],
  expense: [
    "Cost of Goods Sold",
    "Operating Expense",
    "Salaries & Wages",
    "Employee Benefits",
    "Payroll Taxes",
    "Rent Expense",
    "Utilities",
    "Office Supplies",
    "Insurance",
    "Marketing & Advertising",
    "Professional Fees",
    "Legal Fees",
    "Accounting Fees",
    "Travel & Entertainment",
    "Meals & Entertainment",
    "Vehicle Expenses",
    "Repairs & Maintenance",
    "Depreciation",
    "Amortization",
    "Interest Expense",
    "Bank Charges",
    "Tax Expense",
    "Bad Debt Expense",
    "Other Expenses",
  ],
};

interface AccountFormProps {
  initialData?: any;
}

export function AccountForm({ initialData }: AccountFormProps) {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [useCustomSubType, setUseCustomSubType] = useState(false);
  const isEditMode = !!initialData;

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: initialData ? {
      accountCode: initialData.accountCode || "",
      accountName: initialData.accountName || "",
      accountType: initialData.accountType || "asset",
      accountSubType: initialData.accountSubType || "",
      parentAccountId: initialData.parentAccountId?._id || initialData.parentAccountId || "",
      level: initialData.level || 0,
      isParent: initialData.isParent || false,
      description: initialData.description || "",
      currentBalance: initialData.currentBalance || 0,
      isActive: initialData.isActive ?? true,
      allowManualJournal: initialData.allowManualJournal ?? true,
    } : {
      accountCode: "",
      accountName: "",
      accountType: "asset",
      accountSubType: "",
      parentAccountId: "",
      level: 0,
      isParent: false,
      description: "",
      currentBalance: 0,
      isActive: true,
      allowManualJournal: true,
    },
  });

  const selectedType = form.watch("accountType");
  const selectedParent = form.watch("parentAccountId");

  useEffect(() => {
    const fetchAccounts = async () => {
      const result = await getAccounts();
      if (result.success) {
        setAccounts(result.data || []);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedParent) {
      const parent = accounts.find((acc) => acc._id === selectedParent);
      if (parent?.accountSubType) {
        form.setValue("accountSubType", parent.accountSubType);
      }
    }
  }, [selectedParent, accounts, form]);

  const generateAccountCode = () => {
    const typeRanges: Record<string, number> = {
      asset: 1000,
      liability: 2000,
      equity: 3000,
      revenue: 4000,
      expense: 5000,
    };

    const baseCode = typeRanges[selectedType];
    const existingCodes = accounts
      .filter((acc) => acc.accountType === selectedType)
      .map((acc) => parseInt(acc.accountCode))
      .filter((code) => !isNaN(code));

    if (existingCodes.length === 0) {
      return baseCode.toString();
    }

    const maxCode = Math.max(...existingCodes);
    const nextCode = maxCode + 10;
    const maxRange = baseCode + 999;

    return nextCode <= maxRange ? nextCode.toString() : (maxCode + 1).toString();
  };

  const onSubmit = async (data: AccountFormValues) => {
    setIsSubmitting(true);
    try {
      const result = isEditMode
        ? await updateAccount(initialData._id, data, "/")
        : await createAccount(data, "/");
      if (result.success) {
        toast.success(isEditMode ? "Account updated successfully" : "Account created successfully");
        router.push(`/${params.organizationId}/dashboard/${params.userId}/accounting/chart-of-accounts`);
      } else {
        toast.error(result.error || `Failed to ${isEditMode ? "update" : "create"} account`);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chart of Accounts
        </Button>

        <div className="max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isEditMode ? "Edit" : "Create"} Account</CardTitle>
              <CardDescription>{isEditMode ? "Update account information" : "Create accounts based on the 5 accounting elements: Assets, Liabilities, Equity, Revenue, Expenses"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Quick Guide:</strong> Start with main categories (Level 0), then add sub-categories (Level 1), and finally detail accounts (Level 2+).
                  Example: Assets → Current Assets → Cash
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accountCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span>Account Code *</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => {
                            const code = generateAccountCode();
                            form.setValue("accountCode", code);
                          }}
                        >
                          Generate
                        </Button>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 1110" />
                      </FormControl>
                      <FormDescription className="text-xs">
                        <strong>Code Ranges:</strong> 1000-1999 (Assets), 2000-2999 (Liabilities), 3000-3999 (Equity), 4000-4999 (Revenue), 5000-5999 (Expenses)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Cash" />
                      </FormControl>
                      <FormDescription className="text-xs">Descriptive name for the account</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accountTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                  name="accountSubType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span>Sub Type (Optional)</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => setUseCustomSubType(!useCustomSubType)}
                        >
                          {useCustomSubType ? "Select from list" : "Type custom"}
                        </Button>
                      </FormLabel>
                      {useCustomSubType ? (
                        <FormControl>
                          <Input {...field} placeholder="Enter custom sub type" />
                        </FormControl>
                      ) : (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Auto-filled from parent or select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subTypeOptions[selectedType]?.map((subType) => (
                              <SelectItem key={subType} value={subType}>
                                {subType}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <FormDescription className="text-xs">Auto-filled from parent or choose from list/type custom</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="parentAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Account (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="None - This will be a top-level account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts
                          .filter((acc) => acc.accountType === selectedType)
                          .map((acc) => (
                            <SelectItem key={acc._id} value={acc._id}>
                              {acc.accountCode} - {acc.accountName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      <strong>Hierarchy:</strong> Leave empty for main category (e.g., Assets). Select a parent to create sub-accounts (e.g., Cash under Current Assets)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Level</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        <strong>0</strong> = Main (Assets), <strong>1</strong> = Sub (Current Assets), <strong>2+</strong> = Detail (Cash)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opening Balance (GHS)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">Starting balance for this account</FormDescription>
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Account description..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="isParent"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <FormLabel>Parent Account</FormLabel>
                        <FormDescription className="text-xs">Enable if this will have sub-accounts</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <FormLabel>Active</FormLabel>
                        <FormDescription className="text-xs">Account can be used in transactions</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowManualJournal"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <FormLabel>Manual Journal</FormLabel>
                        <FormDescription className="text-xs">Allow manual journal entries</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : isEditMode ? "Update Account" : "Save Account"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
