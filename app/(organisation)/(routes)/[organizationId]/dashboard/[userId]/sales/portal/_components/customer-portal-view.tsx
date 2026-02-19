"use client";

import { Globe, Copy, Check, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { updatePortalSettings } from "@/lib/actions/portal-settings.action";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface CustomerPortalViewProps {
  organizationId: string;
  settings: any;
}

export default function CustomerPortalView({ organizationId, settings }: CustomerPortalViewProps) {
  const [copied, setCopied] = useState(false);
  const [portalEnabled, setPortalEnabled] = useState(settings?.enabled ?? true);
  const [features, setFeatures] = useState(settings?.features || {
    viewInvoices: true,
    makePayments: true,
    downloadDocuments: true,
    viewPaymentHistory: true,
  });
  const pathname = usePathname();
  
  const portalUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/portal/${organizationId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggle = async (field: string, value: boolean) => {
    if (field === "enabled") {
      setPortalEnabled(value);
      await updatePortalSettings({ enabled: value }, pathname);
    } else {
      const newFeatures = { ...features, [field]: value };
      setFeatures(newFeatures);
      await updatePortalSettings({ features: newFeatures }, pathname);
    }
  };

  if (!settings) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Unable to load portal settings</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portal Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${portalEnabled ? "text-emerald-600" : "text-gray-600"}`}>
              {portalEnabled ? "Active" : "Inactive"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {portalEnabled ? "Customers can access" : "Portal disabled"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{settings.activeCustomers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">With portal access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portal Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{settings.totalVisits || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portal Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Customer Portal</Label>
              <p className="text-sm text-muted-foreground">Allow customers to access their portal</p>
            </div>
            <Switch checked={portalEnabled} onCheckedChange={(val) => handleToggle("enabled", val)} />
          </div>

          <div>
            <Label>Portal URL</Label>
            <div className="flex gap-2 mt-2">
              <Input value={portalUrl} readOnly />
              <Button variant="outline" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Link href={`/portal/${organizationId}`} target="_blank">
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Share this URL with your customers to access their portal
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Portal Features</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">View Invoices</span>
                <Switch checked={features.viewInvoices} onCheckedChange={(val) => handleToggle("viewInvoices", val)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Make Payments</span>
                <Switch checked={features.makePayments} onCheckedChange={(val) => handleToggle("makePayments", val)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Download Documents</span>
                <Switch checked={features.downloadDocuments} onCheckedChange={(val) => handleToggle("downloadDocuments", val)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">View Payment History</span>
                <Switch checked={features.viewPaymentHistory} onCheckedChange={(val) => handleToggle("viewPaymentHistory", val)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
