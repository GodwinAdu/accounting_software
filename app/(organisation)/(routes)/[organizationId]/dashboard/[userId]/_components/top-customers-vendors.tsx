"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpIcon } from "lucide-react";

const topCustomers = [
  { id: 1, name: "ABC Corporation", amount: 45000, initials: "AC", trend: 12 },
  { id: 2, name: "XYZ Limited", amount: 38000, initials: "XL", trend: 8 },
  { id: 3, name: "Tech Solutions", amount: 32000, initials: "TS", trend: 15 },
  { id: 4, name: "Global Traders", amount: 28000, initials: "GT", trend: -3 },
  { id: 5, name: "Smart Systems", amount: 24000, initials: "SS", trend: 5 },
];

const topVendors = [
  { id: 1, name: "Office Supplies Co", amount: 18000, initials: "OS", trend: 5 },
  { id: 2, name: "Tech Equipment Ltd", amount: 15000, initials: "TE", trend: 12 },
  { id: 3, name: "Utilities Provider", amount: 12000, initials: "UP", trend: 2 },
  { id: 4, name: "Marketing Agency", amount: 10000, initials: "MA", trend: 8 },
  { id: 5, name: "Legal Services", amount: 8500, initials: "LS", trend: -5 },
];

export default function TopCustomersVendors() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="customers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
          </TabsList>
          <TabsContent value="customers" className="space-y-4 mt-4">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                  {index + 1}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {customer.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    GHS {customer.amount.toLocaleString()}
                  </p>
                </div>
                <div className={`flex items-center text-xs ${customer.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  <ArrowUpIcon className={`h-3 w-3 mr-1 ${customer.trend < 0 ? 'rotate-180' : ''}`} />
                  {Math.abs(customer.trend)}%
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="vendors" className="space-y-4 mt-4">
            {topVendors.map((vendor, index) => (
              <div key={vendor.id} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                  {index + 1}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {vendor.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{vendor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    GHS {vendor.amount.toLocaleString()}
                  </p>
                </div>
                <div className={`flex items-center text-xs ${vendor.trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  <ArrowUpIcon className={`h-3 w-3 mr-1 ${vendor.trend < 0 ? 'rotate-180' : ''}`} />
                  {Math.abs(vendor.trend)}%
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
