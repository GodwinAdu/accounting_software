"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getContacts, deleteContact } from "@/lib/actions/contact.action";
import { usePathname } from "next/navigation";
import ContactDialog from "./contact-dialog";

export default function ContactsTab() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const result = await getContacts();
    if (result.success) setContacts(result.data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this contact?")) {
      await deleteContact(id, pathname);
      loadContacts();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contacts</CardTitle>
        <Button onClick={() => { setSelectedContact(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> New Contact
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact._id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{contact.firstName} {contact.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{contact.email} • {contact.phone}</p>
                  <p className="text-sm">{contact.company} • {contact.title}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedContact(contact); setDialogOpen(true); }}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(contact._id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} contact={selectedContact} onSuccess={loadContacts} />
    </Card>
  );
}
