"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCustomers } from "@/lib/actions/customer.action";

interface CustomerSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomerSelector({ value, onChange }: CustomerSelectorProps) {
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const result = await getCustomers();
    if (result.success) {
      setCustomers(result.data || []);
    }
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select customer" />
      </SelectTrigger>
      <SelectContent>
        {customers.map((customer) => (
          <SelectItem key={customer._id} value={customer._id}>
            {customer.name} {customer.company && `- ${customer.company}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
