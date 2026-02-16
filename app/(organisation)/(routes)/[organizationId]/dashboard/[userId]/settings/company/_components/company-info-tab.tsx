"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchOrganizationUserById, updateOrganizationProfile } from "@/lib/actions/organization.action"
import { Loader2, Building2, Mail, Phone, Globe, MapPin } from "lucide-react"
import { toast } from "sonner"

export default function CompanyInfoTab() {
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
        address: {
          street: org.address?.street || "",
          city: org.address?.city || "",
          state: org.address?.state || "",
          zipCode: org.address?.zipCode || "",
          country: org.address?.country || "Ghana"
        },
        settings: org.settings || {
          timezone: "Africa/Accra",
          currency: "GHS",
          fiscalYearStart: "01-01",
          dateFormat: "DD/MM/YYYY"
        }
      })
    } catch (error) {
      toast.error("Failed to load company profile")
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
        toast.success("Company information updated successfully")
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
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>Basic details about your company</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!editing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!editing}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website
            </Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              disabled={!editing}
              placeholder="https://example.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address
          </CardTitle>
          <CardDescription>Company physical address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              value={formData.address.street}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
              disabled={!editing}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                disabled={!editing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Region *</Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                disabled={!editing}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">Postal Code *</Label>
              <Input
                id="zipCode"
                value={formData.address.zipCode}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                disabled={!editing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.address.country}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })}
                disabled={!editing}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
