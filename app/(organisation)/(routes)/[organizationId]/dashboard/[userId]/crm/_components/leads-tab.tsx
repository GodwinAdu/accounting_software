"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getLeads, deleteLead } from "@/lib/actions/lead.action";
import { usePathname } from "next/navigation";
import LeadDialog from "./lead-dialog";

export default function LeadsTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const result = await getLeads();
    if (result.success) setLeads(result.data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this lead?")) {
      await deleteLead(id, pathname);
      loadLeads();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Leads</CardTitle>
        <Button onClick={() => { setSelectedLead(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> New Lead
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead._id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{lead.name}</h3>
                  <p className="text-sm text-muted-foreground">{lead.email} • {lead.company}</p>
                  <p className="text-sm">Status: {lead.status} • Source: {lead.source}</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedLead(lead); setDialogOpen(true); }}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(lead._id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <LeadDialog open={dialogOpen} onOpenChange={setDialogOpen} lead={selectedLead} onSuccess={loadLeads} />
    </Card>
  );
}
