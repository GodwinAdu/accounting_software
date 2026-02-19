"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getOpportunities, deleteOpportunity } from "@/lib/actions/opportunity.action";
import { usePathname } from "next/navigation";
import OpportunityDialog from "./opportunity-dialog";

export default function OpportunitiesTab() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    const result = await getOpportunities();
    if (result.success) setOpportunities(result.data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this opportunity?")) {
      await deleteOpportunity(id, pathname);
      loadOpportunities();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Opportunities</CardTitle>
        <Button onClick={() => { setSelectedOpportunity(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> New Opportunity
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div key={opp._id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{opp.name}</h3>
                  <p className="text-sm text-muted-foreground">Value: GHS {opp.value.toLocaleString()}</p>
                  <p className="text-sm">Stage: {opp.stage} • Probability: {opp.probability}%</p>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedOpportunity(opp); setDialogOpen(true); }}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(opp._id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <OpportunityDialog open={dialogOpen} onOpenChange={setDialogOpen} opportunity={selectedOpportunity} onSuccess={loadOpportunities} />
    </Card>
  );
}
