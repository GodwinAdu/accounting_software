"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { updateOpportunity } from "@/lib/actions/opportunity.action";
import { usePathname } from "next/navigation";
import OpportunityDialog from "./opportunity-dialog";

interface PipelineBoardProps {
  opportunities: any[];
}

const stages = [
  { id: "prospecting", label: "Prospecting", color: "bg-blue-100 border-blue-300" },
  { id: "qualification", label: "Qualification", color: "bg-yellow-100 border-yellow-300" },
  { id: "proposal", label: "Proposal", color: "bg-orange-100 border-orange-300" },
  { id: "negotiation", label: "Negotiation", color: "bg-purple-100 border-purple-300" },
  { id: "closed-won", label: "Closed Won", color: "bg-green-100 border-green-300" },
  { id: "closed-lost", label: "Closed Lost", color: "bg-red-100 border-red-300" },
];

export default function PipelineBoard({ opportunities }: PipelineBoardProps) {
  const [selectedOpp, setSelectedOpp] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const pathname = usePathname();

  const handleStageChange = async (oppId: string, newStage: string) => {
    const opp = opportunities.find(o => o._id === oppId);
    if (!opp) return;

    await updateOpportunity(oppId, { ...opp, stage: newStage }, pathname);
    window.location.reload();
  };

  const getStageOpportunities = (stageId: string) => {
    return opportunities.filter(o => o.stage === stageId);
  };

  const getStageValue = (stageId: string) => {
    return getStageOpportunities(stageId).reduce((sum, o) => sum + (o.value || 0), 0);
  };

  const totalValue = opportunities.reduce((sum, o) => sum + (o.value || 0), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pipeline Overview</CardTitle>
            <div className="text-2xl font-bold">GHS {totalValue.toLocaleString()}</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            {stages.map(stage => (
              <div key={stage.id} className="text-center">
                <div className="text-sm text-muted-foreground mb-1">{stage.label}</div>
                <div className="text-lg font-bold">{getStageOpportunities(stage.id).length}</div>
                <div className="text-xs text-muted-foreground">GHS {getStageValue(stage.id).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-6 gap-4">
        {stages.map(stage => (
          <div key={stage.id} className="space-y-3">
            <div className={`${stage.color} border-2 rounded-lg p-3`}>
              <h3 className="font-semibold text-sm">{stage.label}</h3>
              <p className="text-xs text-muted-foreground">{getStageOpportunities(stage.id).length} deals</p>
            </div>

            <div className="space-y-2">
              {getStageOpportunities(stage.id).map(opp => (
                <Card 
                  key={opp._id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => { setSelectedOpp(opp); setDialogOpen(true); }}
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="font-medium text-sm truncate">{opp.name}</div>
                    <div className="text-xs font-semibold text-emerald-600">
                      GHS {opp.value.toLocaleString()}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Probability</span>
                        <span className="font-medium">{opp.probability}%</span>
                      </div>
                      <Progress value={opp.probability} className="h-1" />
                    </div>
                    {opp.expectedCloseDate && (
                      <div className="text-xs text-muted-foreground">
                        {new Date(opp.expectedCloseDate).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex gap-1 flex-wrap">
                      {stages.filter(s => s.id !== stage.id).map(s => (
                        <button
                          key={s.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStageChange(opp._id, s.id);
                          }}
                          className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                        >
                          → {s.label}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <OpportunityDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        opportunity={selectedOpp} 
        onSuccess={() => window.location.reload()} 
      />
    </div>
  );
}
