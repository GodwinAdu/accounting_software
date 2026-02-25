"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { updateBudget } from "@/lib/actions/budget.action";
import { toast } from "sonner";

interface EditBudgetFormProps {
  budget: any;
}

export function EditBudgetForm({ budget }: EditBudgetFormProps) {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(budget.name || "");
  const [fiscalYear, setFiscalYear] = useState(budget.fiscalYear || new Date().getFullYear());
  const [startDate, setStartDate] = useState(budget.startDate ? new Date(budget.startDate).toISOString().split('T')[0] : "");
  const [endDate, setEndDate] = useState(budget.endDate ? new Date(budget.endDate).toISOString().split('T')[0] : "");
  const [notes, setNotes] = useState(budget.notes || "");
  const [lineItems, setLineItems] = useState(budget.lineItems || [{ accountId: "", accountCode: "", accountName: "", budgetedAmount: 0 }]);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAccounts() {
      const { getAccountsForDropdown } = await import("@/lib/actions/account-dropdown.action");
      const [revenue, expense] = await Promise.all([
        getAccountsForDropdown("revenue"),
        getAccountsForDropdown("expense")
      ]);
      const allAccounts = [
        ...(revenue.success && revenue.data ? revenue.data : []),
        ...(expense.success && expense.data ? expense.data : [])
      ];
      setAccounts(allAccounts);
    }
    fetchAccounts();
  }, []);

  const handleAddLine = () => {
    setLineItems([...lineItems, { accountId: "", accountCode: "", accountName: "", budgetedAmount: 0 }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const handleLineChange = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    if (field === "accountId") {
      const account = accounts.find(a => a._id === value);
      if (account) {
        updated[index] = {
          ...updated[index],
          accountId: value,
          accountCode: account.accountCode,
          accountName: account.accountName
        };
      }
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setLineItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !startDate || !endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const validLines = lineItems.filter(item => item.accountId && item.budgetedAmount > 0);
    if (validLines.length === 0) {
      toast.error("Please add at least one budget line item");
      return;
    }

    setLoading(true);
    const result = await updateBudget(budget._id, {
      name,
      fiscalYear,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      lineItems: validLines.map(item => ({
        ...item,
        allocations: item.allocations || []
      })),
      notes
    });

    setLoading(false);

    if (result.success) {
      toast.success("Budget updated successfully");
      router.push(`/${params.organizationId}/dashboard/${params.userId}/budgeting/annual`);
    } else {
      toast.error(result.error || "Failed to update budget");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Budget</h2>
          <p className="text-muted-foreground">{budget.budgetNumber}</p>
        </div>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget Name *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Fiscal Year *</Label>
                  <Input type="number" value={fiscalYear} onChange={(e) => setFiscalYear(Number(e.target.value))} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Budget Line Items</CardTitle>
                <Button type="button" size="sm" variant="outline" onClick={handleAddLine}>
                  <Plus className="h-4 w-4 mr-1" /> Add Line
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-end border p-3 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label>Account *</Label>
                    <Select value={item.accountId} onValueChange={(value) => handleLineChange(index, "accountId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account._id} value={account._id}>
                            {account.accountCode} - {account.accountName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-48 space-y-2">
                    <Label>Amount (GHS)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.budgetedAmount || ""}
                      onChange={(e) => handleLineChange(index, "budgetedAmount", Number(e.target.value))}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveLine(index)}
                    disabled={lineItems.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Budget Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="font-bold">
                    GHS {lineItems.reduce((sum, item) => sum + (item.budgetedAmount || 0), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Line Items</span>
                  <span className="font-medium">{lineItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{budget.status}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Updating..." : "Update Budget"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
