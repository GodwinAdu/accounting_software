"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BankAccountsTab from "./bank-accounts-tab";
import PaymentGatewaysTab from "./payment-gateways-tab";
import MobileMoneyTab from "./mobile-money-tab";
import PaymentTermsTab from "./payment-terms-tab";

interface PaymentMethodsTabsProps {
  organizationId: string;
  userId: string;
}

export default function PaymentMethodsTabs({ organizationId, userId }: PaymentMethodsTabsProps) {
  return (
    <Tabs defaultValue="bank-accounts" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="bank-accounts">Bank Accounts</TabsTrigger>
        <TabsTrigger value="gateways">Payment Gateways</TabsTrigger>
        <TabsTrigger value="mobile-money">Mobile Money</TabsTrigger>
        <TabsTrigger value="terms">Payment Terms</TabsTrigger>
      </TabsList>

      <TabsContent value="bank-accounts">
        <BankAccountsTab />
      </TabsContent>

      <TabsContent value="gateways">
        <PaymentGatewaysTab />
      </TabsContent>

      <TabsContent value="mobile-money">
        <MobileMoneyTab />
      </TabsContent>

      <TabsContent value="terms">
        <PaymentTermsTab />
      </TabsContent>
    </Tabs>
  );
}
