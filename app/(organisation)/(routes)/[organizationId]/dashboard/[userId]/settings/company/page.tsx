"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Settings, CreditCard, Shield, DollarSign, FileText, Receipt, Users, Bell, AlertTriangle } from "lucide-react"
import CompanyInfoTab from "./_components/company-info-tab"
import RegionalSettingsTab from "./_components/regional-settings-tab"
import SubscriptionTab from "./_components/subscription-tab"
import SecurityTab from "./_components/security-tab"
import PaymentSettingsTab from "./_components/payment-settings-tab"
import InvoiceSettingsTab from "./_components/invoice-settings-tab"
import TaxSettingsTab from "./_components/tax-settings-tab"
import PayrollSettingsTab from "./_components/payroll-settings-tab"
import NotificationsTab from "./_components/notifications-tab"
import DangerZoneTab from "./_components/danger-zone-tab"

export default function CompanySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Company Settings</h1>
        <p className="text-muted-foreground">Manage your organization settings and preferences</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-auto">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
            <TabsTrigger value="regional" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Regional</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Payment</span>
            </TabsTrigger>
            <TabsTrigger value="invoice" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Invoice</span>
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Tax</span>
            </TabsTrigger>
            <TabsTrigger value="payroll" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Payroll</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Subscription</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="danger" className="flex items-center gap-2 text-red-600 data-[state=active]:text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Danger Zone</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="company">
          <CompanyInfoTab />
        </TabsContent>

        <TabsContent value="regional">
          <RegionalSettingsTab />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentSettingsTab />
        </TabsContent>

        <TabsContent value="invoice">
          <InvoiceSettingsTab />
        </TabsContent>

        <TabsContent value="tax">
          <TaxSettingsTab />
        </TabsContent>

        <TabsContent value="payroll">
          <PayrollSettingsTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionTab />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="danger">
          <DangerZoneTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
