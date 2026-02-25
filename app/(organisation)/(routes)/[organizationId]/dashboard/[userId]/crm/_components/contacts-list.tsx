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
}

export default function ContactsList({ contacts = [], hasCreatePermission }: ContactsListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalContacts = contacts.length;
  const primaryContacts = contacts.filter(c => c.isPrimary).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primary Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{primaryContacts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Secondary Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalContacts - primaryContacts}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contacts</CardTitle>
            {hasCreatePermission && (
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={contacts} searchKey="firstName" />
        </CardContent>
      </Card>

      <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} contact={null} onSuccess={() => window.location.reload()} />
    </div>
  );
}
