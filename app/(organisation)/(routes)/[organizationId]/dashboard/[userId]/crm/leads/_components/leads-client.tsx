"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LeadColumn from "./lead-column";
import LeadCard from "./lead-card";
import CreateLeadDialog from "./create-lead-dialog";
import { updateLeadStatus } from "@/lib/actions/lead.action";
import { toast } from "sonner";

const STATUSES = [
  { value: "new", label: "New", color: "bg-blue-500" },
  { value: "contacted", label: "Contacted", color: "bg-purple-500" },
  { value: "qualified", label: "Qualified", color: "bg-emerald-500" },
  { value: "unqualified", label: "Unqualified", color: "bg-gray-500" },
];

export default function LeadsClient({ initialLeads }: { initialLeads: any[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const leadId = active.id as string;
    const newStatus = over.id as string;

    setLeads((prev) =>
      prev.map((lead) =>
        lead._id === leadId ? { ...lead, status: newStatus } : lead
      )
    );

    const result = await updateLeadStatus(leadId, newStatus);
    if (!result.success) {
      toast.error("Failed to update lead status");
      setLeads(initialLeads);
    }
  };

  const activeLead = activeId ? leads.find((l) => l._id === activeId) : null;

  const getLeadsByStatus = (status: string) =>
    leads.filter((lead) => lead.status === status);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Leads
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your sales leads and track their progress
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-gradient-to-r from-emerald-600 to-teal-600">
          <Plus className="h-4 w-4 mr-2" />
          New Lead
        </Button>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4 flex-1 overflow-hidden">
          {STATUSES.map((status) => (
            <LeadColumn
              key={status.value}
              status={status.value}
              label={status.label}
              color={status.color}
              leads={getLeadsByStatus(status.value)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? <LeadCard lead={activeLead} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <CreateLeadDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
