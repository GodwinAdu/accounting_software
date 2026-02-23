"use client";

import { useState } from "react";
import { AccountSelector } from "@/components/forms/account-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InvoiceFormExample() {
  const [formData, setFormData] = useState({
    customerId: "",
    invoiceDate: "",
    dueDate: "",
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    // Account fields
    revenueAccountId: "",
    receivableAccountId: "",
    taxAccountId: ""
  });

  return (
    <form className="space-y-4">
      {/* Customer, dates, amounts... */}
      
      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-4">Accounting (Optional)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Leave blank to use default accounts
        </p>
        
        {/* Revenue Account Selector */}
        <AccountSelector
          label="Revenue Account"
          accountType="revenue"
          value={formData.revenueAccountId}
          onChange={(value) => setFormData({ ...formData, revenueAccountId: value })}
          placeholder="Select revenue account (e.g., Samsung Fridges)"
        />

        {/* Receivable Account Selector */}
        <AccountSelector
          label="Accounts Receivable"
          accountType="asset"
          value={formData.receivableAccountId}
          onChange={(value) => setFormData({ ...formData, receivableAccountId: value })}
          placeholder="Select receivable account"
        />

        {/* Tax Account Selector */}
        <AccountSelector
          label="Tax Account"
          accountType="liability"
          value={formData.taxAccountId}
          onChange={(value) => setFormData({ ...formData, taxAccountId: value })}
          placeholder="Select tax account (e.g., VAT Payable)"
        />
      </div>

      <Button type="submit">Create Invoice</Button>
    </form>
  );
}
