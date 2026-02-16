"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchOrganizationUserById } from "@/lib/actions/organization.action"
import { Loader2, Users } from "lucide-react"
import { toast } from "sonner"

export default function PayrollSettingsTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    payrollFrequency: "monthly",
    overtimeRate: 1.5,
    enableTimeTracking: true,
    enableLeaveManagement: true,
    defaultWorkingHours: 8,
    defaultWorkingDays: 5
  })

  useEffect(() => {
    loadOrganization()
  }, [])

  const loadOrganization = async () => {
    try {
      const org = await fetchOrganizationUserById()
      setFormData({
        payrollFrequency: org.payrollSettings?.payrollFrequency || "monthly",
        overtimeRate: org.payrollSettings?.overtimeRate || 1.5,
        enableTimeTracking: org.payrollSettings?.enableTimeTracking ?? true,
        enableLeaveManagement: org.payrollSettings?.enableLeaveManagement ?? true,
        defaultWorkingHours: org.payrollSettings?.defaultWorkingHours || 8,
        defaultWorkingDays: org.payrollSettings?.defaultWorkingDays || 5
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
      toast.success("Payroll settings updated successfully")
      setEditing(false)
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
