"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./contacts-columns";
import { useState } from "react";
import ContactDialog from "./contact-dialog";

interface ContactsListProps {
  contacts: any[];
  hasCreatePermission: boolean;
  organizationId: string;
  userId: string;
}

export default function ContactsList({ contacts, hasCreatePermission }: ContactsListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalContacts = contacts.length;
  const customers = contacts.filter(c => c.type === "customer").length;
  const vendors = contacts.filter(c => c.type === "vendor").length;
  const partners = contacts.filter(c => c.type === "partner").length;

  const filterGroups = [
    {
      id: "type",
      label: "Type",
      options: [
        { _id: "customer", label: "Customer" },
        { _id: "vendor", label: "Vendor" },
        { _id: "partner", label: "Partner" },
        { _id: "other", label: "Other" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground mt-1">All contacts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{customers}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalContacts > 0 ? Math.round((customers / totalContacts) * 100) : 0}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{vendors}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalContacts > 0 ? Math.round((vendors / totalContacts) * 100) : 0}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{partners}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalContacts > 0 ? Math.round((partners / totalContacts) * 100) : 0}% of total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contacts</CardTitle>
            {hasCreatePermission && (
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={contacts} searchKey="firstName" filterGroups={filterGroups} />
        </CardContent>
      </Card>

      <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} contact={null} onSuccess={() => window.location.reload()} />
    </div>
  );
}
