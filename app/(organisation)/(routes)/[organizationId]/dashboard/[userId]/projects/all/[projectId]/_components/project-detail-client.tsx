"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Edit, DollarSign, Calendar, User, TrendingUp, RefreshCw } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import TasksTab from "./tasks-tab";
import InvoicesTab from "./invoices-tab";
import ExpensesTab from "./expenses-tab";
import { updateProjectStatus } from "@/lib/actions/project-status.action";

interface ProjectDetailClientProps {
  project: any;
  tasks: any[];
  invoices: any[];
  expenses: any[];
  organizationId: string;
  userId: string;
}

export default function ProjectDetailClient({ project, tasks, invoices, expenses, organizationId, userId }: ProjectDetailClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(project.status);
  
  console.log("=== PROJECT ANALYTICS DEBUG ===");
  console.log("Expenses:", expenses);
  console.log("Invoices:", invoices);
  console.log("Expenses count:", expenses.length);
  console.log("Invoices count:", invoices.length);
  
  const actualCost = expenses.reduce((sum, exp) => {
    console.log(`Expense ${exp.expenseNumber}: ${exp.amount}`);
    return sum + (exp.amount || 0);
  }, 0);
  
  const revenue = invoices.reduce((sum, inv) => {
    console.log(`Invoice ${inv.invoiceNumber}: ${inv.totalAmount}`);
    return sum + (inv.totalAmount || 0);
  }, 0);
  
  console.log("Calculated actualCost:", actualCost);
  console.log("Calculated revenue:", revenue);
  
  const profit = revenue - actualCost;
  
  const progress = project.budget > 0 ? ((actualCost / project.budget) * 100).toFixed(1) : "0";
  const profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : "0";

  const statusColors = {
    planning: "bg-blue-100 text-blue-700",
    active: "bg-emerald-100 text-emerald-700",
    on_hold: "bg-yellow-100 text-yellow-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const result = await updateProjectStatus(project._id, newStatus, pathname);
      if (result.error) {
        toast.error(result.error);
      } else {
        setCurrentStatus(newStatus);
        toast.success(`Project status updated to ${newStatus.replace("_", " ")}`);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <Link href={`/${organizationId}/dashboard/${userId}/projects/all/${project._id}/edit`}>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {project.budget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{progress}% spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actual Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">GHS {actualCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">GHS {revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{profitMargin}% margin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Select value={currentStatus} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              {project.endDate ? format(new Date(project.endDate), "MMM dd, yyyy") : "No end date"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{project.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{project.projectNumber}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Project Manager</h4>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{project.managerId?.fullName || "Unassigned"}</span>
              </div>
            </div>

            {project.clientId && (
              <div>
                <h4 className="font-medium mb-2">Client</h4>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{project.clientId?.name}</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Start Date</h4>
              <p className="text-sm text-muted-foreground">{format(new Date(project.startDate), "PPP")}</p>
            </div>

            {project.endDate && (
              <div>
                <h4 className="font-medium mb-2">End Date</h4>
                <p className="text-sm text-muted-foreground">{format(new Date(project.endDate), "PPP")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
          <TabsTrigger value="expenses">Expenses ({expenses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Budget Utilization</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Spent</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          parseFloat(progress) > 100
                            ? "bg-red-600"
                            : parseFloat(progress) > 80
                            ? "bg-yellow-600"
                            : "bg-emerald-600"
                        }`}
                        style={{ width: `${Math.min(parseFloat(progress), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Profitability</p>
                  <div className="mt-2">
                    <p className="text-2xl font-bold">
                      GHS {profit.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{profitMargin}% margin</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <TasksTab tasks={tasks} projectId={project._id} />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <InvoicesTab invoices={invoices} />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <ExpensesTab expenses={expenses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
