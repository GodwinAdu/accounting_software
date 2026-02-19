"use client";

import { Plus, FileCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import BankRuleDialog from "./bank-rule-dialog";
import { deleteBankRule } from "@/lib/actions/bank-rule.action";
import { usePathname } from "next/navigation";

interface BankRulesListProps {
  rules: any[];
  hasCreatePermission: boolean;
}

export default function BankRulesList({ rules, hasCreatePermission }: BankRulesListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any>(null);
  const pathname = usePathname();

  const activeRules = rules.filter(r => r.status === "active");
  const totalMatches = rules.reduce((sum, r) => sum + (r.matchCount || 0), 0);
  const timeSaved = Math.round((totalMatches * 2) / 60 * 10) / 10;

  const handleDelete = async (id: string) => {
    if (confirm("Delete this rule?")) {
      await deleteBankRule(id, pathname);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Automating categorization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions Matched</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{totalMatches}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">~{timeSaved} hrs</div>
            <p className="text-xs text-muted-foreground mt-1">Manual categorization</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bank Rules</CardTitle>
            {hasCreatePermission && (
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { setSelectedRule(null); setDialogOpen(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="text-center py-12">
              <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No bank rules yet</p>
              {hasCreatePermission && (
                <Button onClick={() => setDialogOpen(true)}>Create Your First Rule</Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div key={rule._id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileCheck className="h-4 w-4 text-emerald-600" />
                        <h3 className="font-semibold">{rule.name}</h3>
                        <Badge className={rule.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                          {rule.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-medium">Condition:</span> {rule.condition.replace("-", " ")} "{rule.value}"
                        </p>
                        {rule.category && (
                          <p className="text-muted-foreground">
                            <span className="font-medium">Category:</span> {rule.category}
                          </p>
                        )}
                        <p className="text-emerald-600 flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {rule.matchCount || 0} transactions matched
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedRule(rule); setDialogOpen(true); }}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(rule._id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <BankRuleDialog open={dialogOpen} onOpenChange={setDialogOpen} rule={selectedRule} onSuccess={() => window.location.reload()} />
    </div>
  );
}
