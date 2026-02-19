"use client";

import { CheckCircle, XCircle, Clock, FileText, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApprovalsListProps {
  pendingExpenses: any[];
  pendingBills: any[];
}

export default function ApprovalsList({ pendingExpenses, pendingBills }: ApprovalsListProps) {
  const totalPending = pendingExpenses.length + pendingBills.length;
  const totalExpenseAmount = pendingExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBillAmount = pendingBills.reduce((sum, b) => sum + b.total, 0);

  const handleApprove = async (id: string, type: string) => {
    console.log(`Approve ${type}:`, id);
    // TODO: Implement approval action
  };

  const handleReject = async (id: string, type: string) => {
    if (confirm(`Reject this ${type}?`)) {
      console.log(`Reject ${type}:`, id);
      // TODO: Implement rejection action
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalPending}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingExpenses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">GHS {totalExpenseAmount.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBills.length}</div>
            <p className="text-xs text-muted-foreground mt-1">GHS {totalBillAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expenses">Expenses ({pendingExpenses.length})</TabsTrigger>
          <TabsTrigger value="bills">Bills ({pendingBills.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Pending Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingExpenses.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending expenses</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingExpenses.map((expense) => (
                    <div key={expense._id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Receipt className="h-4 w-4 text-orange-600" />
                            <h3 className="font-semibold">{expense.description}</h3>
                            <Badge className="bg-orange-100 text-orange-700">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
                            <p>Category: {expense.categoryId?.name || "N/A"}</p>
                            <p className="font-semibold text-foreground">Amount: GHS {expense.amount.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(expense._id, "expense")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(expense._id, "expense")}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bills">
          <Card>
            <CardHeader>
              <CardTitle>Pending Bills</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingBills.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending bills</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingBills.map((bill) => (
                    <div key={bill._id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-orange-600" />
                            <h3 className="font-semibold">{bill.billNumber}</h3>
                            <Badge className="bg-orange-100 text-orange-700">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Vendor: {bill.vendorId?.name || "N/A"}</p>
                            <p>Date: {new Date(bill.date).toLocaleDateString()}</p>
                            <p>Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                            <p className="font-semibold text-foreground">Amount: GHS {bill.total.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(bill._id, "bill")}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(bill._id, "bill")}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
