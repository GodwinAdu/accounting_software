"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Check } from "lucide-react";

export default function PaymentGatewaysTab() {
  return (
    <div className="space-y-6">
      {/* Paystack */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 bg-blue-100">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Paystack</CardTitle>
                <CardDescription>Accept payments via cards and mobile money</CardDescription>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">
              <Check className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Paystack</Label>
              <p className="text-sm text-muted-foreground">Accept payments through Paystack</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Test Mode</Label>
              <p className="text-sm text-muted-foreground">Use test API keys for testing</p>
            </div>
            <Switch />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paystack-public">Public Key</Label>
            <Input
              id="paystack-public"
              type="password"
              placeholder="pk_live_••••••••••••••••"
              defaultValue="pk_live_1234567890abcdef"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paystack-secret">Secret Key</Label>
            <Input
              id="paystack-secret"
              type="password"
              placeholder="sk_live_••••••••••••••••"
              defaultValue="sk_live_1234567890abcdef"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paystack-webhook">Webhook URL</Label>
            <Input
              id="paystack-webhook"
              value="https://yourapp.com/api/webhooks/paystack"
              readOnly
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Add this URL to your Paystack dashboard webhook settings
            </p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Stripe */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 bg-purple-100">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Stripe</CardTitle>
                <CardDescription>Accept international card payments</CardDescription>
              </div>
            </div>
            <Badge variant="outline">Not Connected</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Stripe</Label>
              <p className="text-sm text-muted-foreground">Accept payments through Stripe</p>
            </div>
            <Switch />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripe-public">Publishable Key</Label>
            <Input
              id="stripe-public"
              type="password"
              placeholder="pk_live_••••••••••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripe-secret">Secret Key</Label>
            <Input
              id="stripe-secret"
              type="password"
              placeholder="sk_live_••••••••••••••••"
            />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Connect Stripe</Button>
        </CardContent>
      </Card>

      {/* Bank Transfer */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 bg-green-100">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Bank Transfer</CardTitle>
                <CardDescription>Manual bank transfer payments</CardDescription>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">
              <Check className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Bank Transfer</Label>
              <p className="text-sm text-muted-foreground">Show bank details on invoices</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transfer-instructions">Payment Instructions</Label>
            <textarea
              id="transfer-instructions"
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter instructions for customers making bank transfers..."
              defaultValue="Please transfer to the bank account shown above and use your invoice number as reference."
            />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
