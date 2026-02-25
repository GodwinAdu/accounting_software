"use client";

import { useState, useEffect } from "react";
import { Clock, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { clockIn, clockOut, getCurrentClockIn } from "@/lib/actions/time-entry.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ClockInOut({ employeeId }: { employeeId: string }) {
  const router = useRouter();
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState("");

  useEffect(() => {
    loadCurrentEntry();
  }, []);

  useEffect(() => {
    if (currentEntry?.clockIn) {
      const interval = setInterval(() => {
        const start = new Date(currentEntry.clockIn);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentEntry]);

  const loadCurrentEntry = async () => {
    const result = await getCurrentClockIn(employeeId);
    if (result.success) {
      setCurrentEntry(result.data);
    }
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const result = await clockIn({ employeeId });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Clocked in successfully");
        setCurrentEntry(result.data);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to clock in");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!currentEntry) return;
    setLoading(true);
    try {
      const result = await clockOut(currentEntry._id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Clocked out successfully");
        setCurrentEntry(null);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to clock out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Clock
        </CardTitle>
        <CardDescription>Clock in and out to track your work hours</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentEntry ? (
          <>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Currently clocked in</p>
              <p className="text-3xl font-bold text-emerald-600">{elapsedTime}</p>
              <p className="text-xs text-muted-foreground">
                Started at {new Date(currentEntry.clockIn).toLocaleTimeString()}
              </p>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleClockOut} disabled={loading}>
              <Square className="mr-2 h-4 w-4" />
              Clock Out
            </Button>
          </>
        ) : (
          <>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Not clocked in</p>
              <p className="text-3xl font-bold">--:--:--</p>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleClockIn} disabled={loading}>
              <Play className="mr-2 h-4 w-4" />
              Clock In
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
