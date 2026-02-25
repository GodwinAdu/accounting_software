"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./opportunities-columns";
import { useState } from "react";
import OpportunityDialog from "./opportunity-dialog";

interface OpportunitiesListProps {
  opportunities: any[];
  hasCreatePermission: boolean;
  organizationId: string;
  userId: string;
}

export default function OpportunitiesList({ opportunities = [], hasCreatePermission }: OpportunitiesListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalOpportunities = opportunities.length;
  const openOpportunities = opportunities.filter(o => !["closed_won", "closed_lost"].includes(o.stage)).length;
  const wonOpportunities = opportunities.filter(o => o.stage === "closed_won").length;
  const totalValue = opportunities.reduce((sum, o) => sum + (o.amount || 0), 0);
  const wonValue = opportunities.filter(o => o.stage === "closed_won").reduce((sum, o) => sum + (o.amount || 0), 0);
  const avgProbability = opportunities.length > 0 ? Math.round(opportunities.reduce((sum, o) => sum + o.probability, 0) / opportunities.length) : 0;

  const filterGroups = [
    {
      id: "stage",
      label: "Stage",
      options: [
        { _id: "prospecting", label: "Prospecting" },
        { _id: "qualification", label: "Qualification" },
        { _id: "proposal", label: "Proposal" },
        { _id: "negotiation", label: "Negotiation" },
        { _id: "closed_won", label: "Closed Won" },
        { _id: "closed_lost", label: "Closed Lost" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpportunities}</div>
            <p className="text-xs text-muted-foreground mt-1">{openOpportunities} open</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">GHS {totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total potential</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Won Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{wonOpportunities}</div>
            <p className="text-xs text-muted-foreground mt-1">GHS {wonValue.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Probability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProbability}%</div>
            <p className="text-xs text-muted-foreground mt-1">Success rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Opportunities</CardTitle>
            {hasCreatePermission && (
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Opportunity
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={opportunities} searchKey="name" filterGroups={filterGroups} />
        </CardContent>
      </Card>

      <OpportunityDialog open={dialogOpen} onOpenChange={setDialogOpen} opportunity={null} onSuccess={() => window.location.reload()} />
    </div>
  );
}
