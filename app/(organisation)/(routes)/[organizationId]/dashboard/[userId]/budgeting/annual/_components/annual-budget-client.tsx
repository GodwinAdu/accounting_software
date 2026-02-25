"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, TrendingUp, AlertCircle, Plus, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreateBudgetDialog from "./create-budget-dialog";

interface AnnualBudgetClientProps {
  budgets: any[];
  hasCreatePermission: boolean;
}

export default function AnnualBudgetClient({ budgets = [], hasCreatePermission }: AnnualBudgetClientProps) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const activeBudgets = budgets.filter(b => b.status === "active").length;
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.totalBudget, 0);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalBudgeted.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{currentYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Budgets</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBudgets}</div>
            <p className="text-xs text-muted-foreground mt-1">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Budgets</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgets.filter(b => b.status === "draft").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending activation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Budgets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgets.filter(b => b.status === "closed").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Annual Budgets</CardTitle>
          {hasCreatePermission && (
            <CreateBudgetDialog>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Budget
              </Button>
            </CreateBudgetDialog>
          )}
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No annual budgets created</p>
              <p className="text-sm text-muted-foreground mt-2">Create your first annual budget to start tracking</p>
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map((budget) => (
                <div key={budget._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Link href={`/budgeting/variance?budgetId=${budget._id}`} className="flex items-center gap-3 flex-1">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{budget.name}</p>
                      <p className="text-sm text-muted-foreground">
                        FY {budget.fiscalYear} • {budget.lineItems?.length || 0} accounts
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">GHS {budget.totalBudget.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total budget</p>
                    </div>
                    <Badge variant={budget.status === "active" ? "default" : budget.status === "draft" ? "secondary" : "outline"}>
                      {budget.status}
                    </Badge>
                    {budget.status === "draft" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/budgeting/annual/${budget._id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
