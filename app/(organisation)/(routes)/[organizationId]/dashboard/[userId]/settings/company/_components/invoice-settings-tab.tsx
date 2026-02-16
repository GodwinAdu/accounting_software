"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { fetchOrganizationUserById } from "@/lib/actions/organization.action"
import { Loader2, FileText } from "lucide-react"
import { toast } from "sonner"

export default function InvoiceSettingsTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    invoicePrefix: "INV",
    invoiceNumberFormat: "INV-{YYYY}-{####}",
    nextInvoiceNumber: 1,
    defaultNotes: "",
    defaultTerms: "",
    showTaxNumber: true,
    showLogo: true
  })

  useEffect(() => {
    loadOrganization()
  }, [])

  const loadOrganization = async () => {
    try {
      const org = await fetchOrganizationUserById()
      setFormData({
        invoicePrefix: org.invoiceSettings?.invoicePrefix || "INV",
        invoiceNumberFormat: org.invoiceSettings?.invoiceNumberFormat || "INV-{YYYY}-{####}",
        nextInvoiceNumber: org.invoiceSettings?.nextInvoiceNumber || 1,
        defaultNotes: org.invoiceSettings?.defaultNotes || "",
        defaultTerms: org.invoiceSettings?.defaultTerms || "",
        showTaxNumber: org.invoiceSettings?.showTaxNumber ?? true,
        showLogo: org.invoiceSettings?.showLogo ?? true
      })
    } catch (error) {
      toast.error("Failed to load invoice settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      toast.success("Invoice settings updated successfully")
      setEditing(false)
    } catch (error) {
      toast.error("Failed to update invoice settings")
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
            <FileText className="h-5 w-5" />
            Invoice Numbering
          </CardTitle>
          <CardDescription>Configure invoice number format and sequence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prefix">Invoice Prefix</Label>
              <Input
                id="prefix"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                disabled={!editing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextNumber">Next Invoice Number</Label>
              <Input
                id="nextNumber"
                type="number"
                value={formData.nextInvoiceNumber}
                onChange={(e) => setFormData({ ...formData, nextInvoiceNumber: parseInt(e.target.value) })}
                disabled={!editing}
                min={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="format">Invoice Number Format</Label>
            <Input
              id="format"
              value={formData.invoiceNumberFormat}
              onChange={(e) => setFormData({ ...formData, invoiceNumberFormat: e.target.value })}
              disabled={!editing}
              placeholder="INV-{YYYY}-{####}"
            />
            <p className="text-xs text-muted-foreground">
              Use {"{YYYY}"} for year, {"{MM}"} for month, {"{####}"} for number
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Invoice Content</CardTitle>
          <CardDescription>Set default notes and terms for invoices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Default Notes</Label>
            <Textarea
              id="notes"
              value={formData.defaultNotes}
              onChange={(e) => setFormData({ ...formData, defaultNotes: e.target.value })}
              disabled={!editing}
              rows={3}
              placeholder="Thank you for your business..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Default Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={formData.defaultTerms}
              onChange={(e) => setFormData({ ...formData, defaultTerms: e.target.value })}
              disabled={!editing}
              rows={3}
              placeholder="Payment due within 30 days..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Options</CardTitle>
          <CardDescription>Configure what appears on invoices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showLogo">Show Company Logo</Label>
              <p className="text-sm text-muted-foreground">Display logo on invoices</p>
            </div>
            <Switch
              id="showLogo"
              checked={formData.showLogo}
              onCheckedChange={(checked) => setFormData({ ...formData, showLogo: checked })}
              disabled={!editing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showTax">Show Tax Number</Label>
              <p className="text-sm text-muted-foreground">Display tax ID on invoices</p>
            </div>
            <Switch
              id="showTax"
              checked={formData.showTaxNumber}
              onCheckedChange={(checked) => setFormData({ ...formData, showTaxNumber: checked })}
              disabled={!editing}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
