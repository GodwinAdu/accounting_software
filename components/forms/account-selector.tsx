"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getAccountsForDropdown } from "@/lib/actions/account-dropdown.action";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface AccountSelectorProps {
  label: string;
  accountType?: "revenue" | "expense" | "asset" | "liability";
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function AccountSelector({
  label,
  accountType,
  value,
  onChange,
  placeholder = "Select account",
  required = false
}: AccountSelectorProps) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    async function fetchAccounts() {
      const result = await getAccountsForDropdown(accountType);
      if (result.success && result.data) {
        setAccounts(result.data);
      }
      setLoading(false);
    }
    fetchAccounts();
  }, [accountType]);

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={loading || accounts.length === 0}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Loading..." : accounts.length === 0 ? "No accounts available" : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account) => (
            <SelectItem key={account._id} value={account._id}>
              {account.accountCode} - {account.accountName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!loading && accounts.length === 0 && (
        <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>
            No {accountType} accounts found.{" "}
            <Link 
              href={`/${params.organizationId}/dashboard/${params.userId}/accounting/chart-of-accounts`}
              className="underline font-medium hover:text-amber-700"
            >
              Create accounts
            </Link>
            {" "}or leave blank to use default.
          </span>
        </div>
      )}
      {accountType === 'revenue' && (
        <p className="text-xs text-muted-foreground">Select the income category where this sale will be recorded</p>
      )}
      {accountType === 'expense' && (
        <p className="text-xs text-muted-foreground">Select the expense category for this transaction (e.g., Office Supplies, Utilities, Rent)</p>
      )}
      {accountType === 'asset' && placeholder.includes('Receivable') && (
        <p className="text-xs text-muted-foreground">Select the account that tracks money owed by customers</p>
      )}
      {accountType === 'asset' && placeholder.includes('Cash') && (
        <p className="text-xs text-muted-foreground">Select the bank or cash account where payment was deposited</p>
      )}
      {accountType === 'liability' && (
        <p className="text-xs text-muted-foreground">Select the account where collected taxes are held before payment to authorities</p>
      )}
    </div>
  );
}
