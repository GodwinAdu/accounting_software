   "use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DateRangeFilter({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const presets = [
    {
      label: "Today",
      getValue: () => ({
        from: new Date(),
        to: new Date(),
      }),
    },
    {
      label: "Yesterday",
      getValue: () => ({
        from: addDays(new Date(), -1),
        to: addDays(new Date(), -1),
      }),
    },
    {
      label: "Last 7 days",
      getValue: () => ({
        from: addDays(new Date(), -7),
        to: new Date(),
      }),
    },
    {
      label: "Last 30 days",
      getValue: () => ({
        from: addDays(new Date(), -30),
        to: new Date(),
      }),
    },
    {
      label: "This Month",
      getValue: () => ({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(),
      }),
    },
    {
      label: "Last Month",
      getValue: () => ({
        from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      }),
    },
    {
      label: "This Quarter",
      getValue: () => {
        const now = new Date();
        const quarter = Math.floor(now.getMonth() / 3);
        return {
          from: new Date(now.getFullYear(), quarter * 3, 1),
          to: new Date(),
        };
      },
    },
    {
      label: "This Year",
      getValue: () => ({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
      }),
    },
    {
      label: "Last Year",
      getValue: () => ({
        from: new Date(new Date().getFullYear() - 1, 0, 1),
        to: new Date(new Date().getFullYear() - 1, 11, 31),
      }),
    },
    {
      label: "All Time",
      getValue: () => ({
        from: new Date(2020, 0, 1),
        to: new Date(),
      }),
    },
  ];

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex">
            <div className="border-r">
              <div className="p-3">
                <p className="text-sm font-medium mb-2">Presets</p>
                <div className="space-y-1">
                  {presets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      className="w-full justify-start font-normal"
                      onClick={() => setDate(preset.getValue())}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
