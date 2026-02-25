"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BudgetVarianceClientProps {
  budgets: any[];
}

export default function BudgetVarianceClient({ budgets }: BudgetVarianceClientProps) {
  const [expandedBudgets, setExpandedBudgets] = useState<Set<string>>(new Set());

  const toggleBudget = (budgetNumber: string) => {
    const newExpanded = new Set(expandedBudgets);
    if (newExpanded.has(budgetNumber)) {
      newExpanded.delete(budgetNumber);
    } else {
      newExpanded.add(budgetNumber);
    }
    setExpandedBudgets(newExpanded);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variance Analysis</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Click on any budget to see account-level breakdown</p>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No active budgets to analyze</p>
            <p className="text-sm text-muted-foreground mt-2">Create and activate budgets to track variance</p>
          </div>
        ) : (
          <div className="space-y-3">
            {budgets.map((analysis: any) => {
              const variance = analysis.summary.totalVariance;
              const varPercent = analysis.summary.variancePercent.toFixed(1);
              const isFavorable = variance >= 0;
              const isExpanded = expandedBudgets.has(analysis.budget.budgetNumber);
              const utilizationPercent = analysis.summary.totalBudgeted > 0 
                ? (analysis.summary.totalActual / analysis.summary.totalBudgeted) * 100 
                : 0;

              return (
                <div key={analysis.budget.budgetNumber} className="border rounded-lg">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleBudget(analysis.budget.budgetNumber)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <div>
                          <h3 className="font-semibold">{analysis.budget.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            FY {analysis.budget.fiscalYear} • {analysis.lineItems.length} accounts
                          </p>
                        </div>
                      </div>
                      <Badge variant={isFavorable ? "default" : "destructive"}>
                        {isFavorable ? 'Favorable' : 'Unfavorable'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Budgeted</p>
                        <p className="font-medium">GHS {analysis.summary.totalBudgeted.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Actual</p>
                        <p className="font-medium">GHS {analysis.summary.totalActual.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Variance</p>
                        <p className={`font-medium ${isFavorable ? 'text-emerald-600' : 'text-red-600'}`}>
                          GHS {Math.abs(variance).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Variance %</p>
                        <p className={`font-medium ${isFavorable ? 'text-emerald-600' : 'text-red-600'}`}>
                          {varPercent}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Budget Utilization</span>
                        <span>{utilizationPercent.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={Math.min(utilizationPercent, 100)} 
                        className={utilizationPercent > 100 ? "bg-red-100" : ""}
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t bg-gray-50 p-4">
                      <h4 className="font-medium mb-3 text-sm">Account-Level Breakdown</h4>
                      <div className="space-y-2">
                        {analysis.lineItems.map((item: any, index: number) => {
                          const itemFavorable = item.variance >= 0;
                          const itemUtilization = item.budgeted > 0 
                            ? (item.actual / item.budgeted) * 100 
                            : 0;
                          
                          return (
                            <div key={index} className="bg-white p-3 rounded border">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{item.accountCode} - {item.accountName}</p>
                                </div>
                                <Badge variant={itemFavorable ? "outline" : "destructive"} className="text-xs">
                                  {itemFavorable ? 'Under' : 'Over'}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-3 text-xs mb-2">
                                <div>
                                  <p className="text-muted-foreground">Budgeted</p>
                                  <p className="font-medium">GHS {item.budgeted.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Actual</p>
                                  <p className="font-medium">GHS {item.actual.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Variance</p>
                                  <p className={`font-medium ${itemFavorable ? 'text-emerald-600' : 'text-red-600'}`}>
                                    GHS {Math.abs(item.variance).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Variance %</p>
                                  <p className={`font-medium ${itemFavorable ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {item.variancePercent.toFixed(1)}%
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Utilization</span>
                                  <span>{itemUtilization.toFixed(1)}%</span>
                                </div>
                                <Progress 
                                  value={Math.min(itemUtilization, 100)} 
                                  className={itemUtilization > 100 ? "bg-red-100" : ""}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
