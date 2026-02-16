"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Percent, AlertCircle } from "lucide-react";

export default function PaymentTermsTab() {
  return (
    <div className="space-y-6">
      {/* Default Payment Terms */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2 bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Default Payment Terms</CardTitle>
              <CardDescription>Set default payment terms for new invoices</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-terms">Default Payment Terms</Label>
            <Select defaultValue="net30">
              <SelectTrigger id="default-terms">
                <SelectValue placeholder="Select payment terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                <SelectItem value="net7">Net 7 days</SelectItem>
                <SelectItem value="net15">Net 15 days</SelectItem>
                <SelectItem value="net30">Net 30 days</SelectItem>
                <SelectItem value="net45">Net 45 days</SelectItem>
                <SelectItem value="net60">Net 60 days</SelectItem>
                <SelectItem value="net90">Net 90 days</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom-days">Custom Days (if selected)</Label>
            <Input
              id="custom-days"
              type="number"
              placeholder="Enter number of days"
            />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Late Payment Fees */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2 bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle>Late Payment Fees</CardTitle>
              <CardDescription>Configure late payment penalties</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Late Fees</Label>
              <p className="text-sm text-muted-foreground">Charge fees for overdue invoices</p>
            </div>
            <Switch />
          </div>
          <div className="space-y-2">
            <Label htmlFor="late-fee-type">Fee Type</Label>
            <Select defaultValue="percentage">
              <SelectTrigger id="late-fee-type">
                <SelectValue placeholder="Select fee type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="late-fee-amount">Fee Amount</Label>
            <div className="flex gap-2">
              <Input
                id="late-fee-amount"
                type="number"
                placeholder="5"
                defaultValue="5"
              />
              <span className="flex items-center text-muted-foreground">%</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="grace-period">Grace Period (days)</Label>
            <Input
              id="grace-period"
              type="number"
              placeholder="7"
              defaultValue="7"
            />
            <p className="text-xs text-muted-foreground">
              Number of days after due date before late fee applies
            </p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Early Payment Discounts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-2 bg-green-100">
              <Percent className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>Early Payment Discounts</CardTitle>
              <CardDescription>Offer discounts for early payments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Early Payment Discounts</Label>
              <p className="text-sm text-muted-foreground">Incentivize customers to pay early</p>
            </div>
            <Switch />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount-percentage">Discount Percentage</Label>
            <div className="flex gap-2">
              <Input
                id="discount-percentage"
                type="number"
                placeholder="2"
                defaultValue="2"
              />
              <span className="flex items-center text-muted-foreground">%</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount-days">Discount Period (days)</Label>
            <Input
              id="discount-days"
              type="number"
              placeholder="10"
              defaultValue="10"
            />
            <p className="text-xs text-muted-foreground">
              Number of days from invoice date to qualify for discount
            </p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Instructions</CardTitle>
          <CardDescription>Custom instructions shown on invoices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment-instructions">Instructions</Label>
            <textarea
              id="payment-instructions"
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Enter payment instructions for customers..."
              defaultValue="Thank you for your business! Please make payment within the specified terms. For any payment queries, contact our accounts team."
            />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
