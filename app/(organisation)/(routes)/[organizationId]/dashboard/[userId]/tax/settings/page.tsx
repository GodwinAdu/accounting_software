"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";

export default function TaxSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Tax Settings"
          description="Configure tax rates and compliance settings"
        />
        <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
      <Separator />

      <div className="max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Tax Information</CardTitle>
            <CardDescription>Your organization's tax registration details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tax Identification Number (TIN)</Label>
                <Input placeholder="Enter TIN" defaultValue="C0012345678" />
              </div>
              <div className="space-y-2">
                <Label>VAT Registration Number</Label>
                <Input placeholder="Enter VAT number" defaultValue="VAT-GH-123456" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tax Office</Label>
                <Select defaultValue="accra">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accra">Accra Large Taxpayer Office</SelectItem>
                    <SelectItem value="kumasi">Kumasi Tax Office</SelectItem>
                    <SelectItem value="takoradi">Takoradi Tax Office</SelectItem>
                    <SelectItem value="tamale">Tamale Tax Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tax Year End</Label>
                <Select defaultValue="december">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="december">December 31</SelectItem>
                    <SelectItem value="march">March 31</SelectItem>
                    <SelectItem value="june">June 30</SelectItem>
                    <SelectItem value="september">September 30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>VAT Settings</CardTitle>
            <CardDescription>Configure VAT rates and filing preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>VAT Registered</Label>
                <p className="text-sm text-muted-foreground">Enable VAT collection and filing</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Standard VAT Rate (%)</Label>
                <Input type="number" step="0.01" defaultValue="12.5" />
                <p className="text-xs text-muted-foreground">
                  Ghana standard rate: 12.5% (includes NHIL, GETFund, etc.)
                </p>
              </div>
              <div className="space-y-2">
                <Label>VAT Filing Frequency</Label>
                <Select defaultValue="monthly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cash Accounting</Label>
                <p className="text-sm text-muted-foreground">Account for VAT on cash basis</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income Tax Settings</CardTitle>
            <CardDescription>PAYE and corporate tax configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Corporate Tax Rate (%)</Label>
                <Input type="number" step="0.01" defaultValue="25" />
                <p className="text-xs text-muted-foreground">Standard corporate tax rate in Ghana</p>
              </div>
              <div className="space-y-2">
                <Label>Withholding Tax Rate (%)</Label>
                <Input type="number" step="0.01" defaultValue="7.5" />
                <p className="text-xs text-muted-foreground">Standard WHT rate for services</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="mb-3 block">PAYE Tax Brackets (Annual Income)</Label>
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="font-medium">Income Range (GHS)</div>
                  <div className="font-medium">Rate (%)</div>
                  <div className="font-medium">Annual Tax</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>0 - 4,380</div>
                  <div>0%</div>
                  <div>0</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>4,381 - 6,000</div>
                  <div>5%</div>
                  <div>81</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>6,001 - 40,000</div>
                  <div>10%</div>
                  <div>3,481</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>40,001 - 200,000</div>
                  <div>17.5%</div>
                  <div>31,481</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>200,001+</div>
                  <div>25%</div>
                  <div>Variable</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Tax filing reminders and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>VAT Filing Reminders</Label>
                <p className="text-sm text-muted-foreground">Get notified before VAT filing deadline</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>PAYE Payment Reminders</Label>
                <p className="text-sm text-muted-foreground">Reminders for monthly PAYE payments</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tax Compliance Alerts</Label>
                <p className="text-sm text-muted-foreground">Alerts for compliance issues</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
