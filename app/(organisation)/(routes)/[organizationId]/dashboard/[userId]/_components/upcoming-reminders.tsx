"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, Clock } from "lucide-react";

const reminders = [
  {
    id: 1,
    title: "Payroll Due",
    date: "Jan 31, 2024",
    type: "urgent",
    description: "Monthly payroll processing",
  },
  {
    id: 2,
    title: "VAT Filing Deadline",
    date: "Feb 15, 2024",
    type: "warning",
    description: "Q4 2023 VAT return",
  },
  {
    id: 3,
    title: "Invoice Payment Due",
    date: "Feb 5, 2024",
    type: "info",
    description: "ABC Corp - Invoice #1234",
  },
  {
    id: 4,
    title: "Annual Tax Filing",
    date: "Mar 31, 2024",
    type: "info",
    description: "Corporate tax return 2023",
  },
];

export default function UpcomingReminders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
              <div className={`rounded-full p-2 mt-1 ${
                reminder.type === 'urgent' ? 'bg-red-100' :
                reminder.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                {reminder.type === 'urgent' ? (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{reminder.title}</p>
                  <Badge
                    variant={reminder.type === 'urgent' ? 'destructive' : 'secondary'}
                    className={
                      reminder.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : ''
                    }
                  >
                    {reminder.date}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{reminder.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
