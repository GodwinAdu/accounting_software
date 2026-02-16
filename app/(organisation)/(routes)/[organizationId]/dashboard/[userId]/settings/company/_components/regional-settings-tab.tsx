"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchOrganizationUserById, updateOrganizationProfile } from "@/lib/actions/organization.action"
import { Loader2, Settings } from "lucide-react"
import { toast } from "sonner"

export default function RegionalSettingsTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    taxId: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Ghana"
    },
    settings: {
      timezone: "Africa/Accra",
      currency: "GHS",
      fiscalYearStart: "01-01",
      dateFormat: "DD/MM/YYYY"
    }
  })

  useEffect(() => {
    loadOrganization()
  }, [])

  const loadOrganization = async () => {
    try {
      const org = await fetchOrganizationUserById()
      setFormData({
        name: org.name || "",
        email: org.email || "",
        phone: org.phone || "",
        website: org.website || "",
        taxId: org.taxId || "",
        address: org.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "Ghana"
        },
        settings: {
          timezone: org.settings?.timezone || "Africa/Accra",
          currency: org.settings?.currency || "GHS",
          fiscalYearStart: org.settings?.fiscalYearStart || "01-01",
          dateFormat: org.settings?.dateFormat || "DD/MM/YYYY"
        }
      })
    } catch (error) {
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const result = await updateOrganizationProfile(formData)
      
      if (result.success) {
        toast.success("Regional settings updated successfully")
        setEditing(false)
      } else {
        toast.error(result.error || "Failed to update")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-end">
        {!editing ? (
          <Button onClick={() => setEditing(true)} type="button">Edit</Button>
        ) : (
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
            <Button type="button" variant="outline" onClick={() => { setEditing(false); loadOrganization() }} disabled={saving}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Regional Settings
          </CardTitle>
          <CardDescription>Configure timezone, currency, and date formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.settings.timezone}
                onValueChange={(value) => setFormData({ ...formData, settings: { ...formData.settings, timezone: value } })}
                disabled={!editing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Accra">Africa/Accra (GMT)</SelectItem>
                  <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                  <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.settings.currency}
                onValueChange={(value) => setFormData({ ...formData, settings: { ...formData.settings, currency: value } })}
                disabled={!editing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                  <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
              <Select
                value={formData.settings.fiscalYearStart}
                onValueChange={(value) => setFormData({ ...formData, settings: { ...formData.settings, fiscalYearStart: value } })}
                disabled={!editing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="01-01">January 1</SelectItem>
                  <SelectItem value="04-01">April 1</SelectItem>
                  <SelectItem value="07-01">July 1</SelectItem>
                  <SelectItem value="10-01">October 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select
                value={formData.settings.dateFormat}
                onValueChange={(value) => setFormData({ ...formData, settings: { ...formData.settings, dateFormat: value } })}
                disabled={!editing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
