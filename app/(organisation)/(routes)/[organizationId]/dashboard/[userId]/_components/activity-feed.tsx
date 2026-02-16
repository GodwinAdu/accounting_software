"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Receipt, DollarSign, UserPlus, Settings } from "lucide-react";

const activities = [
  {
    id: 1,
    user: "John Mensah",
    initials: "JM",
    action: "created invoice",
    target: "#INV-1234",
    time: "5 minutes ago",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: 2,
    user: "Sarah Osei",
    initials: "SO",
    action: "processed payroll",
    target: "December 2023",
    time: "1 hour ago",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    id: 3,
    user: "Kwame Asante",
    initials: "KA",
    action: "added expense",
    target: "Office Supplies",
    time: "2 hours ago",
    icon: Receipt,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
  {
    id: 4,
    user: "Ama Boateng",
    initials: "AB",
    action: "invited user",
    target: "new.user@company.com",
    time: "3 hours ago",
    icon: UserPlus,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    id: 5,
    user: "Kofi Adjei",
    initials: "KA",
    action: "updated settings",
    target: "Tax Configuration",
    time: "5 hours ago",
    icon: Settings,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
];

export default function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                  {activity.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <div className={`rounded-full p-2 ${activity.bgColor}`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
