"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StartReconciliationDialog } from "./start-reconciliation-dialog";

interface ReconciliationToolProps {
  organizationId: string;
  userId: string;
  reconciliations: any[];
  accounts: any[];
}

export default function ReconciliationTool({ 
  organizationId, 
  userId, 
  reconciliations,
  accounts 
}: ReconciliationToolProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const completed = reconciliations.filter((r) => r.status === "completed");
  const inProgress = reconciliations.filter((r) => r.status === "in-progress");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reconciliations</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reconciliations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{completed.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully reconciled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgress.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending completion</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reconciliation History</CardTitle>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Start Reconciliation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reconciliations.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reconciliations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start your first bank reconciliation to match your records with bank statements
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Start First Reconciliation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reconciliations.map((reconciliation) => (
                <Card key={reconciliation._id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{reconciliation.reconciliationNumber}</h3>
                          {getStatusBadge(reconciliation.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {reconciliation.bankAccountId?.bankName} - {reconciliation.bankAccountId?.accountName}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Statement Date</p>
                            <p className="text-sm font-medium">
                              {new Date(reconciliation.statementDate).toLocaleDateString("en-GB")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Statement Balance</p>
                            <p className="text-sm font-medium">GHS {reconciliation.statementBalance.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Book Balance</p>
                            <p className="text-sm font-medium">GHS {reconciliation.bookBalance.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Difference</p>
                            <p className={`text-sm font-medium ${
                              reconciliation.difference === 0 ? "text-emerald-600" : "text-red-600"
                            }`}>
                              GHS {Math.abs(reconciliation.difference).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      {reconciliation.status === "in-progress" && (
                        <Button variant="outline" size="sm">
                          Continue
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <StartReconciliationDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        accounts={accounts}
      />
    </div>
  );
}
