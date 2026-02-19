"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";

export default function EmployeeLeaveRequests({ leaveRequests }: any) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "pending": return "secondary";
      case "rejected": return "destructive";
      default: return "outline";
    }
  };

  const getLeaveTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Leave Requests</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Request Leave
        </Button>
      </CardHeader>
      <CardContent>
        {leaveRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No leave requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaveRequests.map((request: any) => (
              <div key={request._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{getLeaveTypeLabel(request.leaveType)} Leave</p>
                    <Badge variant={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(request.startDate), "MMM dd, yyyy")} - {format(new Date(request.endDate), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {request.days} day{request.days > 1 ? "s" : ""}
                  </p>
                  {request.reason && (
                    <p className="text-sm mt-1">{request.reason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
