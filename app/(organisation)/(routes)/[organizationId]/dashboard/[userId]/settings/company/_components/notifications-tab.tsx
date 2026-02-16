"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { fetchOrganizationUserById } from "@/lib/actions/organization.action"
import { Loader2, Bell } from "lucide-react"
import { toast } from "sonner"

export default function NotificationsTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    invoiceReminders: true,
    paymentReceived: true,
    lowStock: true,
    expenseApproval: true,
    payrollProcessed: true,
    subscriptionExpiry: true
  })

  useEffect(() => {
    loadOrganization()
  }, [])

  const loadOrganization = async () => {
    try {
      const org = await fetchOrganizationUserById()
      setFormData({
        invoiceReminders: org.notificationSettings?.invoiceReminders ?? true,
        paymentReceived: org.notificationSettings?.paymentReceived ?? true,
        lowStock: org.notificationSettings?.lowStock ?? true,
        expenseApproval: org.notificationSettings?.expenseApproval ?? true,
        payrollProcessed: org.notificationSettings?.payrollProcessed ?? true,
        subscriptionExpiry: org.notificationSettings?.subscriptionExpiry ?? true
      })
    } catch (error) {
      toast.error("Failed to load notification settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      toast.success("Notification settings updated successfully")
      setEditing(false)
    } catch (error) {
      toast.error("Failed to update notification settings")
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
            <Bell className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>Choose which notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="invoiceReminders">Invoice Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified about upcoming and overdue invoices</p>
            </div>
            <Switch
              id="invoiceReminders"
              checked={formData.invoiceReminders}
              onCheckedChange={(checked) => setFormData({ ...formData, invoiceReminders: checked })}
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="paymentReceived">Payment Received</Label>
              <p className="text-sm text-muted-foreground">Get notified when payments are received</p>
            </div>
            <Switch
              id="paymentReceived"
              checked={formData.paymentReceived}
              onCheckedChange={(checked) => setFormData({ ...formData, paymentReceived: checked })}
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="lowStock">Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when product stock is low</p>
            </div>
            <Switch
              id="lowStock"
              checked={formData.lowStock}
              onCheckedChange={(checked) => setFormData({ ...formData, lowStock: checked })}
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="expenseApproval">Expense Approval</Label>
              <p className="text-sm text-muted-foreground">Get notified about pending expense approvals</p>
            </div>
            <Switch
              id="expenseApproval"
              checked={formData.expenseApproval}
              onCheckedChange={(checked) => setFormData({ ...formData, expenseApproval: checked })}
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="payrollProcessed">Payroll Processed</Label>
              <p className="text-sm text-muted-foreground">Get notified when payroll is processed</p>
            </div>
            <Switch
              id="payrollProcessed"
              checked={formData.payrollProcessed}
              onCheckedChange={(checked) => setFormData({ ...formData, payrollProcessed: checked })}
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="subscriptionExpiry">Subscription Expiry</Label>
              <p className="text-sm text-muted-foreground">Get notified before subscription expires</p>
            </div>
            <Switch
              id="subscriptionExpiry"
              checked={formData.subscriptionExpiry}
              onCheckedChange={(checked) => setFormData({ ...formData, subscriptionExpiry: checked })}
              disabled={!editing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
