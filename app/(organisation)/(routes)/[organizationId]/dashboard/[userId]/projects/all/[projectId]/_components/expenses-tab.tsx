"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DollarSign, Calendar, Tag } from "lucide-react";

interface ExpensesTabProps {
  expenses: any[];
}

export default function ExpensesTab({ expenses }: ExpensesTabProps) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidExpenses = expenses.filter(exp => exp.status === "paid");
  const pendingExpenses = expenses.filter(exp => exp.status === "pending");

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    paid: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{expenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              GHS {paidExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{paidExpenses.length} paid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              GHS {pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{pendingExpenses.length} pending</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No expenses linked to this project yet</p>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{expense.description}</p>
                      <Badge className={statusColors[expense.status as keyof typeof statusColors]}>
                        {expense.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(expense.date), "MMM dd, yyyy")}
                      </div>
                      {expense.vendorId && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {expense.vendorId.companyName}
                        </div>
                      )}
                      {expense.categoryId && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {expense.categoryId.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">GHS {expense.amount.toLocaleString()}</p>
                    {expense.taxAmount > 0 && (
                      <p className="text-xs text-muted-foreground">+GHS {expense.taxAmount.toFixed(2)} tax</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
