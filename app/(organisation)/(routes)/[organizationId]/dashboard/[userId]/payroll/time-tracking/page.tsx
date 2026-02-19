import { Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTimeEntries } from "@/lib/actions/time-entry.action";

export default async function TimeTrackingPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const entriesResult = await getTimeEntries();
  const entries = entriesResult.data || [];

  const formattedEntries = entries.map((entry: any) => {
    const clockIn = new Date(entry.clockIn);
    const clockOut = entry.clockOut ? new Date(entry.clockOut) : null;
    
    return {
      _id: entry._id,
      id: entry._id,
      employee: entry.employeeId?.userId?.fullName || "N/A",
      employeeNumber: entry.employeeId?.employeeNumber || "",
      date: new Date(entry.date).toLocaleDateString(),
      clockIn: clockIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clockOut: clockOut ? clockOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--",
      totalHours: entry.totalHours,
      overtime: entry.overtimeHours,
      status: entry.status,
    };
  });

  const totalHours = entries.reduce((sum: number, entry: any) => sum + entry.totalHours, 0);
  const totalOvertime = entries.reduce((sum: number, entry: any) => sum + entry.overtimeHours, 0);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Time Tracking"
          description="Track employee work hours and attendance"
        />
        <div className="flex gap-3">
          <Select defaultValue="this-week">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
            <p className="text-2xl font-bold">{entries.length}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
            <p className="text-2xl font-bold text-emerald-600">{totalHours.toFixed(1)}h</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Overtime Hours</p>
            <p className="text-2xl font-bold text-blue-600">{totalOvertime.toFixed(1)}h</p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={formattedEntries} />
    </div>
  );
}
