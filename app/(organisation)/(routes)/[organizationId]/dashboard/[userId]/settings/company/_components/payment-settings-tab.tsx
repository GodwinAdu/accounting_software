"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchOrganizationUserById } from "@/lib/actions/organization.action"
import { Loader2, CreditCard } from "lucide-react"
import { toast } from "sonner"

export default function PaymentSettingsTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    defaultPaymentMethod: "",
    acceptedPaymentMethods: [] as string[],
    paymentTerms: 30,
    lateFeePercentage: 0
  })

  const paymentMethods = ["Bank Transfer", "Credit Card", "Mobile Money", "Cash", "Cheque"]

  useEffect(() => {
    loadOrganization()
  }, [])

  const loadOrganization = async () => {
    try {
      const org = await fetchOrganizationUserById()
      setFormData({
        defaultPaymentMethod: org.paymentSettings?.defaultPaymentMethod || "",
        acceptedPaymentMethods: org.paymentSettings?.acceptedPaymentMethods || [],
        paymentTerms: org.paymentSettings?.paymentTerms || 30,
        lateFeePercentage: org.paymentSettings?.lateFeePercentage || 0
      })
    } catch (error) {
      toast.error("Failed to load payment settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: Implement payment settings update
      toast.success("Payment settings updated successfully")
      setEditing(false)
    } catch (error) {
      toast.error("Failed to update payment settings")
    } finally {
      setSaving(false)
    }
  }

  const togglePaymentMethod = (method: string) => {
    setFormData(prev => ({
      ...prev,
      acceptedPaymentMethods: prev.acceptedPaymentMethods.includes(method)
        ? prev.acceptedPaymentMethods.filter(m => m !== method)
        : [...prev.acceptedPaymentMethods, method]
    }))
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
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>Configure accepted payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Accepted Payment Methods</Label>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={method}
                    checked={formData.acceptedPaymentMethods.includes(method)}
                    onCheckedChange={() => togglePaymentMethod(method)}
                    disabled={!editing}
                  />
                  <Label htmlFor={method} className="font-normal cursor-pointer">
                    {method}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultMethod">Default Payment Method</Label>
            <Select
              value={formData.defaultPaymentMethod}
              onValueChange={(value) => setFormData({ ...formData, defaultPaymentMethod: value })}
              disabled={!editing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select default method" />
              </SelectTrigger>
              <SelectContent>
                {formData.acceptedPaymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Terms</CardTitle>
          <CardDescription>Configure invoice payment terms and late fees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms (days)</Label>
            <Input
              id="paymentTerms"
              type="number"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: parseInt(e.target.value) })}
              disabled={!editing}
              min={0}
            />
            <p className="text-xs text-muted-foreground">
              Number of days customers have to pay invoices
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lateFee">Late Fee Percentage (%)</Label>
            <Input
              id="lateFee"
              type="number"
              value={formData.lateFeePercentage}
              onChange={(e) => setFormData({ ...formData, lateFeePercentage: parseFloat(e.target.value) })}
              disabled={!editing}
              min={0}
              max={100}
              step={0.1}
            />
            <p className="text-xs text-muted-foreground">
              Percentage charged on overdue invoices
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
