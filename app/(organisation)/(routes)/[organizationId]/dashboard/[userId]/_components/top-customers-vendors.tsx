"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TopCustomersVendorsProps {
  topCustomers: any[];
  topVendors: any[];
}

export default function TopCustomersVendors({ topCustomers, topVendors }: TopCustomersVendorsProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

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
            {topCustomers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No customer data yet</p>
            ) : (
              topCustomers.map((customer, index) => (
                <div key={customer._id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    {index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      GHS {customer.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
          <TabsContent value="vendors" className="space-y-4 mt-4">
            {topVendors.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No vendor data yet</p>
            ) : (
              topVendors.map((vendor, index) => (
                <div key={vendor._id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                    {index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {getInitials(vendor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{vendor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      GHS {vendor.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
