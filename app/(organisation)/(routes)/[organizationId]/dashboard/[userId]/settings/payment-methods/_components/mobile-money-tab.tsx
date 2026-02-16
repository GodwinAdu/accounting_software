"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Check } from "lucide-react";

export default function MobileMoneyTab() {
  return (
    <div className="space-y-6">
      {/* MTN Mobile Money */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 bg-yellow-100">
                <Smartphone className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <CardTitle>MTN Mobile Money</CardTitle>
                <CardDescription>Accept payments via MTN MoMo</CardDescription>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">
              <Check className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable MTN MoMo</Label>
              <p className="text-sm text-muted-foreground">Accept MTN Mobile Money payments</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mtn-merchant">Merchant Code</Label>
            <Input
              id="mtn-merchant"
              placeholder="Enter MTN merchant code"
              defaultValue="MTN123456"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mtn-phone">Business Phone Number</Label>
            <Input
              id="mtn-phone"
              placeholder="024XXXXXXX"
              defaultValue="0241234567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mtn-name">Account Name</Label>
            <Input
              id="mtn-name"
              placeholder="Business name"
              defaultValue="PayFlow Business"
            />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Vodafone Cash */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 bg-red-100">
                <Smartphone className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle>Vodafone Cash</CardTitle>
                <CardDescription>Accept payments via Vodafone Cash</CardDescription>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">
              <Check className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Vodafone Cash</Label>
              <p className="text-sm text-muted-foreground">Accept Vodafone Cash payments</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label htmlFor="voda-merchant">Merchant Code</Label>
            <Input
              id="voda-merchant"
              placeholder="Enter Vodafone merchant code"
              defaultValue="VOD789012"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="voda-phone">Business Phone Number</Label>
            <Input
              id="voda-phone"
              placeholder="020XXXXXXX"
              defaultValue="0201234567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="voda-name">Account Name</Label>
            <Input
              id="voda-name"
              placeholder="Business name"
              defaultValue="PayFlow Business"
            />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
        </CardContent>
      </Card>

      {/* AirtelTigo Money */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg p-2 bg-orange-100">
                <Smartphone className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>AirtelTigo Money</CardTitle>
                <CardDescription>Accept payments via AirtelTigo Money</CardDescription>
              </div>
            </div>
            <Badge variant="outline">Inactive</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable AirtelTigo Money</Label>
              <p className="text-sm text-muted-foreground">Accept AirtelTigo Money payments</p>
            </div>
            <Switch />
          </div>
          <div className="space-y-2">
            <Label htmlFor="airtel-merchant">Merchant Code</Label>
            <Input
              id="airtel-merchant"
              placeholder="Enter AirtelTigo merchant code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="airtel-phone">Business Phone Number</Label>
            <Input
              id="airtel-phone"
              placeholder="027XXXXXXX"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="airtel-name">Account Name</Label>
            <Input
              id="airtel-name"
              placeholder="Business name"
            />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
