"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchOrganizationUserById, updateTaxSettings } from "@/lib/actions/organization.action"
import { Loader2, Receipt } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function TaxSettingsTab() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    taxRegistered: false,
    taxNumber: "",
    taxRate: 0,
    taxType: "",
    enableTaxCalculation: true
  })

  useEffect(() => {
    loadOrganization()
  }, [])

  const loadOrganization = async () => {
    try {
      const org = await fetchOrganizationUserById()
      setFormData({
        taxRegistered: org.taxSettings?.taxRegistered || false,
        taxNumber: org.taxSettings?.taxNumber || "",
        taxRate: org.taxSettings?.taxRate || 0,
        taxType: org.taxSettings?.taxType || "",
        enableTaxCalculation: org.taxSettings?.enableTaxCalculation ?? true
      })
    } catch (error) {
      toast.error("Failed to load tax settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateTaxSettings(formData)
      if (result.success) {
        toast.success("Tax settings updated successfully")
        setEditing(false)
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update tax settings")
      }
    } catch (error) {
      toast.error("Failed to update tax settings")
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
            <Receipt className="h-5 w-5" />
            Tax Registration
          </CardTitle>
          <CardDescription>Configure tax registration details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="taxRegistered">Tax Registered</Label>
              <p className="text-sm text-muted-foreground">Is your company registered for tax?</p>
            </div>
            <Switch
              id="taxRegistered"
              checked={formData.taxRegistered}
              onCheckedChange={(checked) => setFormData({ ...formData, taxRegistered: checked })}
              disabled={!editing}
            />
          </div>

          {formData.taxRegistered && (
            <>
              <div className="space-y-2">
                <Label htmlFor="taxNumber">Tax Number</Label>
                <Input
                  id="taxNumber"
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  disabled={!editing}
                  placeholder="Enter tax registration number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxType">Tax Type</Label>
                <Select
                  value={formData.taxType}
                  onValueChange={(value) => setFormData({ ...formData, taxType: value })}
                  disabled={!editing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VAT">VAT</SelectItem>
                    <SelectItem value="GST">GST</SelectItem>
                    <SelectItem value="Sales Tax">Sales Tax</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                  disabled={!editing}
                  min={0}
                  max={100}
                  step={0.1}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Calculation</CardTitle>
          <CardDescription>Configure automatic tax calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableCalc">Enable Tax Calculation</Label>
              <p className="text-sm text-muted-foreground">
                Automatically calculate tax on invoices and transactions
              </p>
            </div>
            <Switch
              id="enableCalc"
              checked={formData.enableTaxCalculation}
              onCheckedChange={(checked) => setFormData({ ...formData, enableTaxCalculation: checked })}
              disabled={!editing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
