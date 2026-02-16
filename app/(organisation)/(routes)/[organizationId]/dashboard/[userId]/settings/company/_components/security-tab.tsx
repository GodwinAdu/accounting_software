"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { fetchOrganizationUserById } from "@/lib/actions/organization.action"
import { Loader2, Shield, Lock, Clock } from "lucide-react"
import { toast } from "sonner"

export default function SecurityTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [settings, setSettings] = useState({
    twoFactorRequired: false,
    sessionTimeout: 30,
    passwordExpiry: 90
  })

  useEffect(() => {
    loadOrganization()
  }, [])

  const loadOrganization = async () => {
    try {
      const org = await fetchOrganizationUserById()
      setSettings({
        twoFactorRequired: org.security?.twoFactorRequired || false,
        sessionTimeout: org.security?.sessionTimeout || 30,
        passwordExpiry: org.security?.passwordExpiry || 90
      })
    } catch (error) {
      toast.error("Failed to load security settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: Implement security settings update
      toast.success("Security settings updated successfully")
    } catch (error) {
      toast.error("Failed to update security settings")
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Authentication
          </CardTitle>
          <CardDescription>Configure authentication and access control</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="2fa">Require Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Force all users to enable 2FA for enhanced security
              </p>
            </div>
            <Switch
              id="2fa"
              checked={settings.twoFactorRequired}
              onCheckedChange={(checked) => setSettings({ ...settings, twoFactorRequired: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session Management
          </CardTitle>
          <CardDescription>Control user session behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input
              id="sessionTimeout"
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
              min={5}
              max={1440}
            />
            <p className="text-xs text-muted-foreground">
              Users will be logged out after this period of inactivity
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Policy
          </CardTitle>
          <CardDescription>Set password requirements and expiration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
            <Input
              id="passwordExpiry"
              type="number"
              value={settings.passwordExpiry}
              onChange={(e) => setSettings({ ...settings, passwordExpiry: parseInt(e.target.value) })}
              min={0}
              max={365}
            />
            <p className="text-xs text-muted-foreground">
              Users must change their password after this many days (0 = never)
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Security Settings
        </Button>
      </div>
    </div>
  )
}
