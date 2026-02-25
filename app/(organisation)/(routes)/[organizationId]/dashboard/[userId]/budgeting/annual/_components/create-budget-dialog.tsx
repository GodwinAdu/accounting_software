"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, Info, Check, ChevronsUpDown } from "lucide-react";
import { createBudget } from "@/lib/actions/budget.action";
import { createDepartment } from "@/lib/actions/department.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CreateBudgetDialogProps {
  children: React.ReactNode;
  departmentId?: string;
}

export default function CreateBudgetDialog({ children, departmentId }: CreateBudgetDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<Array<{
    accountId: string;
    accountCode: string;
    accountName: string;
    budgetedAmount: number;
  }>>([{ accountId: "", accountCode: "", accountName: "", budgetedAmount: 0 }]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState(departmentId || "");
  const [deptOpen, setDeptOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [creatingDept, setCreatingDept] = useState(false);

  useEffect(() => {
    async function fetchAccounts() {
      const { getAccountsForDropdown } = await import("@/lib/actions/account-dropdown.action");
      const { getAllDepartments } = await import("@/lib/actions/department.action");
      const [revenue, expense, depts] = await Promise.all([
        getAccountsForDropdown("revenue"),
        getAccountsForDropdown("expense"),
        getAllDepartments()
      ]);
      const allAccounts = [
        ...(revenue.success && revenue.data ? revenue.data : []),
        ...(expense.success && expense.data ? expense.data : [])
      ];
      setAccounts(allAccounts);
      setDepartments(Array.isArray(depts) ? depts : []);
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

  const handleCreateDepartment = async () => {
    if (!newDeptName.trim()) {
      toast.error("Department name is required");
      return;
    }
    setCreatingDept(true);
    try {
      await createDepartment({ name: newDeptName });
      const { getAllDepartments } = await import("@/lib/actions/department.action");
      const depts = await getAllDepartments();
      setDepartments(Array.isArray(depts) ? depts : []);
      toast.success("Department created");
      setNewDeptName("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create department");
    }
    setCreatingDept(false);
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
    const result = await createBudget({
      name,
      fiscalYear,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      departmentId: selectedDepartment || undefined,
      lineItems: validLines.map(item => ({
        ...item,
        allocations: []
      })),
      notes
    });

    setLoading(false);

    if (result.success) {
      toast.success("Budget created successfully");
      setOpen(false);
      router.refresh();
      setName("");
      setFiscalYear(new Date().getFullYear());
      setStartDate("");
      setEndDate("");
      setNotes("");
      setLineItems([{ accountId: "", accountCode: "", accountName: "", budgetedAmount: 0 }]);
    } else {
      toast.error(result.error || "Failed to create budget");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:max-w-3xl w-[96%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Annual Budget</DialogTitle>
          <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">What is a budget?</p>
              <p className="text-blue-700">A budget helps you plan how much money you expect to earn (revenue) and spend (expenses) during a period. You'll compare your plan to actual amounts to control spending and track performance.</p>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Budget Name <span className="text-red-500">*</span></Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="FY 2024 Budget" required />
            </div>
            <div className="space-y-2">
              <Label>Fiscal Year <span className="text-red-500">*</span></Label>
              <Input type="number" value={fiscalYear} onChange={(e) => setFiscalYear(Number(e.target.value))} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date <span className="text-red-500">*</span></Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>End Date <span className="text-red-500">*</span></Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Department (Optional)</Label>
            <Popover open={deptOpen} onOpenChange={setDeptOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedDepartment ? departments.find(d => d._id === selectedDepartment)?.name : "Select department"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search department..." />
                  <CommandEmpty>No department found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem value="none" onSelect={() => { setSelectedDepartment(""); setDeptOpen(false); }}>
                      <Check className={`mr-2 h-4 w-4 ${selectedDepartment === "" ? "opacity-100" : "opacity-0"}`} />
                      No Department
                    </CommandItem>
                    {departments.map((dept) => (
                      <CommandItem key={dept._id} value={dept.name} onSelect={() => { setSelectedDepartment(dept._id); setDeptOpen(false); }}>
                        <Check className={`mr-2 h-4 w-4 ${selectedDepartment === dept._id ? "opacity-100" : "opacity-0"}`} />
                        {dept.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
                <div className="border-t p-2 space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="New department name" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} />
                    <Button size="sm" onClick={handleCreateDepartment} disabled={creatingDept}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">Assign this budget to a specific department</p>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Budget Line Items <span className="text-red-500">*</span></Label>
                <Button type="button" size="sm" variant="outline" onClick={handleAddLine}>
                  <Plus className="h-4 w-4 mr-1" /> Add Line
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Add revenue and expense accounts only. Budgets track income/spending, not assets or liabilities. Example: "Salaries Expense - GHS 60,000" means you plan to spend GHS 60,000 on salaries this year.</p>
            </div>
            
            {lineItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-end border p-3 rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label>Account (Revenue/Expense) <span className="text-red-500">*</span></Label>
                  <Select value={item.accountId} onValueChange={(value) => handleLineChange(index, "accountId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select revenue or expense account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">No accounts available</div>
                      ) : (
                        accounts.map((account) => (
                          <SelectItem key={account._id} value={account._id}>
                            {account.accountCode} - {account.accountName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Only revenue (income) and expense (spending) accounts are shown</p>
                </div>
                <div className="w-48 space-y-2">
                  <Label>Planned Amount (GHS)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.budgetedAmount || ""}
                    onChange={(e) => handleLineChange(index, "budgetedAmount", Number(e.target.value))}
                    placeholder="0.00"
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
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." rows={3} />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm">
              <span className="text-muted-foreground">Total Planned: </span>
              <span className="font-semibold text-foreground">GHS {lineItems.reduce((sum, item) => sum + (item.budgetedAmount || 0), 0).toLocaleString()}</span>
              <p className="text-xs text-muted-foreground mt-1">This is your financial plan. You'll compare it to actual amounts later.</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600" disabled={loading}>
                {loading ? "Creating..." : "Create Budget"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
