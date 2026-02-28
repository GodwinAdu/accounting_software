"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, Database, Mail, Shield, Zap } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: "PayFlow",
    supportEmail: "support@payflow.com",
    maintenanceMode: false,
    allowSignups: true,
    requireEmailVerification: true,
    maxOrganizations: 1000,
    defaultPlan: "free",
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground">Configure global platform settings</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Platform Name</Label>
              <Input
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Default Subscription Plan</Label>
              <Input
                value={settings.defaultPlan}
                onChange={(e) => setSettings({ ...settings, defaultPlan: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Organizations</Label>
              <Input
                type="number"
                value={settings.maxOrganizations}
                onChange={(e) => setSettings({ ...settings, maxOrganizations: parseInt(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Access
            </CardTitle>
            <CardDescription>Control platform access and security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Disable access for all users except super admins</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow New Signups</Label>
                <p className="text-sm text-muted-foreground">Enable new organization registrations</p>
              </div>
              <Switch
                checked={settings.allowSignups}
                onCheckedChange={(checked) => setSettings({ ...settings, allowSignups: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">Users must verify email before accessing platform</p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Management
            </CardTitle>
            <CardDescription>Maintenance and backup operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Database className="h-4 w-4 mr-2" />
              Run Database Backup
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Zap className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600">
              <Database className="h-4 w-4 mr-2" />
              Clean Deleted Records
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </CardTitle>
            <CardDescription>Platform-wide email settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SMTP Host</Label>
              <Input placeholder="smtp.example.com" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SMTP Port</Label>
                <Input type="number" placeholder="587" />
              </div>
              <div className="space-y-2">
                <Label>Encryption</Label>
                <Input placeholder="TLS" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>SMTP Username</Label>
              <Input placeholder="noreply@payflow.com" />
            </div>
            <div className="space-y-2">
              <Label>SMTP Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full bg-emerald-600 hover:bg-emerald-700">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
