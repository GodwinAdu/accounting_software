"use client";

import { Bell, Mail, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PaymentRemindersListProps {
  overdueInvoices: any[];
}

export default function PaymentRemindersList({ overdueInvoices }: PaymentRemindersListProps) {
  const [autoReminders, setAutoReminders] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);
  const remindersSent = 45;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueInvoices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">GHS {totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Outstanding amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reminders Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{remindersSent}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reminder Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Automatic Reminders</Label>
              <p className="text-sm text-muted-foreground">Send reminders automatically</p>
            </div>
            <Switch checked={autoReminders} onCheckedChange={setAutoReminders} />
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Notification Channels</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Email Reminders</span>
                </div>
                <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">SMS Reminders</span>
                </div>
                <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Reminder Schedule</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>3 days before due date</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>On due date</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>7 days after due date</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>14 days after due date</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overdue Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {overdueInvoices.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No overdue invoices</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueInvoices.map((invoice) => (
                <div key={invoice._id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                        <Badge className="bg-red-100 text-red-700">Overdue</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Customer: {invoice.customerId?.name || "N/A"}</p>
                        <p>Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        <p className="font-semibold text-red-600">Amount: GHS {(invoice.total - invoice.amountPaid).toLocaleString()}</p>
                      </div>
                    </div>
                    <Button size="sm">Send Reminder</Button>
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
