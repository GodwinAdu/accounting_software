"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchOrganizationUserById, updatePayrollSettings } from "@/lib/actions/organization.action"
import { getAccounts } from "@/lib/actions/account.action"
import { Loader2, Users, DollarSign } from "lucide-react"
import { toast } from "sonner"

export default function PayrollSettingsTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [accounts, setAccounts] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    payrollFrequency: "monthly",
    overtimeRate: 1.5,
    enableTimeTracking: true,
    enableLeaveManagement: true,
    defaultWorkingHours: 8,
    defaultWorkingDays: 5,
    salaryExpenseAccountId: "",
    salaryPayableAccountId: "",
    taxPayableAccountId: ""
  })

  console.log(accounts,"accounts")
  console.log(formData,"formData")

  useEffect(() => {
    loadOrganization()
  }, [])

  const loadOrganization = async () => {
    try {
      const [org, accountsResult] = await Promise.all([
        fetchOrganizationUserById(),
        getAccounts()
      ]);
      const allAccounts = accountsResult?.data || [];
      setAccounts(allAccounts);
      
      const findAccount = (name: string, type: string) => 
        allAccounts.find((a: any) => a.accountName.toLowerCase().includes(name.toLowerCase()) && a.accountType === type)?._id || "";
      
      setFormData({
        payrollFrequency: org.payrollSettings?.payrollFrequency || "monthly",
        overtimeRate: org.payrollSettings?.overtimeRate || 1.5,
        enableTimeTracking: org.payrollSettings?.enableTimeTracking ?? true,
        enableLeaveManagement: org.payrollSettings?.enableLeaveManagement ?? true,
        defaultWorkingHours: org.payrollSettings?.defaultWorkingHours || 8,
        defaultWorkingDays: org.payrollSettings?.defaultWorkingDays || 5,
        salaryExpenseAccountId: String(org.payrollSettings?.salaryExpenseAccountId || findAccount("salary expense", "expense")),
        salaryPayableAccountId: String(org.payrollSettings?.salaryPayableAccountId || findAccount("salaries payable", "liability")),
        taxPayableAccountId: String(org.payrollSettings?.taxPayableAccountId || findAccount("tax payable", "liability"))
      })
    } catch (error) {
      toast.error("Failed to load payroll settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updatePayrollSettings(formData);
      if (result.success) {
        toast.success("Payroll settings updated successfully")
        setEditing(false)
      } else {
        toast.error(result.error || "Failed to update payroll settings")
      }
    } catch (error) {
      toast.error("Failed to update payroll settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {!editing ? (
          <Button onClick={() => setEditing(true)} type="button">Edit</Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
            <Button variant="outline" onClick={() => { setEditing(false); loadOrganization() }} disabled={saving}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Account Mapping
          </CardTitle>
          <CardDescription>Map payroll transactions to chart of accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Salary Expense Account</Label>
            <Select
              value={formData.salaryExpenseAccountId}
              onValueChange={(value) => setFormData({ ...formData, salaryExpenseAccountId: value })}
              disabled={!editing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account">
                  {formData.salaryExpenseAccountId && accounts.find(a => a._id === formData.salaryExpenseAccountId)
                    ? `${accounts.find(a => a._id === formData.salaryExpenseAccountId)?.accountCode} - ${accounts.find(a => a._id === formData.salaryExpenseAccountId)?.accountName}`
                    : "Select account"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {accounts.filter(a => a.accountType === "expense").map((account) => (
                  <SelectItem key={account._id} value={String(account._id)}>
                    {account.accountCode} - {account.accountName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Salary Payable Account</Label>
            <Select
              value={formData.salaryPayableAccountId}
              onValueChange={(value) => setFormData({ ...formData, salaryPayableAccountId: value })}
              disabled={!editing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account">
                  {formData.salaryPayableAccountId && accounts.find(a => a._id === formData.salaryPayableAccountId)
                    ? `${accounts.find(a => a._id === formData.salaryPayableAccountId)?.accountCode} - ${accounts.find(a => a._id === formData.salaryPayableAccountId)?.accountName}`
                    : "Select account"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {accounts.filter(a => a.accountType === "liability").map((account) => (
                  <SelectItem key={account._id} value={String(account._id)}>
                    {account.accountCode} - {account.accountName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tax Payable Account</Label>
            <Select
              value={formData.taxPayableAccountId}
              onValueChange={(value) => setFormData({ ...formData, taxPayableAccountId: value })}
              disabled={!editing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account">
                  {formData.taxPayableAccountId && accounts.find(a => a._id === formData.taxPayableAccountId)
                    ? `${accounts.find(a => a._id === formData.taxPayableAccountId)?.accountCode} - ${accounts.find(a => a._id === formData.taxPayableAccountId)?.accountName}`
                    : "Select account"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {accounts.filter(a => a.accountType === "liability").map((account) => (
                  <SelectItem key={account._id} value={String(account._id)}>
                    {account.accountCode} - {account.accountName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Payroll Configuration
          </CardTitle>
          <CardDescription>Configure payroll processing settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">Payroll Frequency</Label>
            <Select
              value={formData.payrollFrequency}
              onValueChange={(value) => setFormData({ ...formData, payrollFrequency: value })}
              disabled={!editing}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="overtime">Overtime Rate Multiplier</Label>
            <Input
              id="overtime"
              type="number"
              value={formData.overtimeRate}
              onChange={(e) => setFormData({ ...formData, overtimeRate: parseFloat(e.target.value) })}
              disabled={!editing}
              min={1}
              max={3}
              step={0.1}
            />
            <p className="text-xs text-muted-foreground">
              Multiplier for overtime pay (e.g., 1.5 = time and a half)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
          <CardDescription>Set default working hours and days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Default Working Hours/Day</Label>
              <Input
                id="hours"
                type="number"
                value={formData.defaultWorkingHours}
                onChange={(e) => setFormData({ ...formData, defaultWorkingHours: parseInt(e.target.value) })}
                disabled={!editing}
                min={1}
                max={24}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="days">Default Working Days/Week</Label>
              <Input
                id="days"
                type="number"
                value={formData.defaultWorkingDays}
                onChange={(e) => setFormData({ ...formData, defaultWorkingDays: parseInt(e.target.value) })}
                disabled={!editing}
                min={1}
                max={7}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>Enable or disable payroll features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="timeTracking">Time Tracking</Label>
              <p className="text-sm text-muted-foreground">Track employee working hours</p>
            </div>
            <Switch
              id="timeTracking"
              checked={formData.enableTimeTracking}
              onCheckedChange={(checked) => setFormData({ ...formData, enableTimeTracking: checked })}
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="leaveManagement">Leave Management</Label>
              <p className="text-sm text-muted-foreground">Manage employee leave requests</p>
            </div>
            <Switch
              id="leaveManagement"
              checked={formData.enableLeaveManagement}
              onCheckedChange={(checked) => setFormData({ ...formData, enableLeaveManagement: checked })}
              disabled={!editing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
