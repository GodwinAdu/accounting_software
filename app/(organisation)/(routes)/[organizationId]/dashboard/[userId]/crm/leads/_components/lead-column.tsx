"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import LeadCard from "./lead-card";
import { cn } from "@/lib/utils";

interface LeadColumnProps {
  status: string;
  label: string;
  color: string;
  leads: any[];
}

export default function LeadColumn({ status, label, color, leads }: LeadColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className={cn("w-3 h-3 rounded-full", color)} />
        <h3 className="font-semibold text-sm">{label}</h3>
        <span className="text-xs text-muted-foreground">({leads.length})</span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-lg border-2 border-dashed p-2 overflow-y-auto transition-colors",
          isOver ? "border-emerald-500 bg-emerald-50/50" : "border-gray-200 bg-gray-50/50"
        )}
      >
        <SortableContext items={leads.map((l) => l._id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {leads.map((lead) => (
              <LeadCard key={lead._id} lead={lead} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
