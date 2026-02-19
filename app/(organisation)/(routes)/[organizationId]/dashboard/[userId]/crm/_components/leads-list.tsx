"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./leads-columns";
import { useState } from "react";
import LeadDialog from "./lead-dialog";

interface LeadsListProps {
  leads: any[];
  hasCreatePermission: boolean;
  organizationId: string;
  userId: string;
}

export default function LeadsList({ leads, hasCreatePermission }: LeadsListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === "new").length;
  const qualifiedLeads = leads.filter(l => l.status === "qualified").length;
  const convertedLeads = leads.filter(l => l.status === "converted").length;
  const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);

  const filterGroups = [
    {
      id: "status",
      label: "Status",
      options: [
        { _id: "new", label: "New" },
        { _id: "contacted", label: "Contacted" },
        { _id: "qualified", label: "Qualified" },
        { _id: "unqualified", label: "Unqualified" },
        { _id: "converted", label: "Converted" },
      ],
    },
    {
      id: "source",
      label: "Source",
      options: [
        { _id: "website", label: "Website" },
        { _id: "referral", label: "Referral" },
        { _id: "social", label: "Social Media" },
        { _id: "email", label: "Email" },
        { _id: "cold-call", label: "Cold Call" },
        { _id: "other", label: "Other" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">{newLeads} new</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{qualifiedLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{convertedLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0}% conversion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Pipeline value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Leads</CardTitle>
            {hasCreatePermission && (
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={leads} searchKey="name" filterGroups={filterGroups} />
        </CardContent>
      </Card>

      <LeadDialog open={dialogOpen} onOpenChange={setDialogOpen} lead={null} onSuccess={() => window.location.reload()} />
    </div>
  );
}
