"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Mail, Phone, TrendingUp, UserCheck, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { convertLeadToCustomer, createOpportunityFromLead } from "@/lib/actions/crm-integration.action";
import { toast } from "sonner";
import { useState } from "react";

interface LeadCardProps {
  lead: any;
  isDragging?: boolean;
}

const RATING_COLORS = {
  hot: "bg-red-100 text-red-700 border-red-200",
  warm: "bg-orange-100 text-orange-700 border-orange-200",
  cold: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function LeadCard({ lead, isDragging }: LeadCardProps) {
  const [converting, setConverting] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
    id: lead._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const displayName = lead.name;
  const displayValue = lead.value;

  const handleConvertToCustomer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setConverting(true);
    try {
      const result = await convertLeadToCustomer(lead._id);
      setConverting(false);
      if (result.success) {
        toast.success("Lead converted to customer successfully");
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to convert lead");
      }
    } catch (error: any) {
      setConverting(false);
      toast.error(error.message || "Failed to convert lead");
    }
  };

  const handleCreateOpportunity = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setConverting(true);
    try {
      const result = await createOpportunityFromLead(lead._id, {
        name: `${lead.name} - ${lead.company || 'Opportunity'}`,
        amount: lead.value || 0,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      setConverting(false);
      if (result.success) {
        toast.success("Opportunity created successfully");
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to create opportunity");
      }
    } catch (error: any) {
      setConverting(false);
      toast.error(error.message || "Failed to create opportunity");
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow",
        isDragging && "shadow-lg rotate-2"
      )}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{displayName}</h4>
            {lead.company && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Building2 className="h-3 w-3" />
                {lead.company}
              </div>
            )}
          </div>
          {lead.rating && (
            <Badge variant="outline" className={cn("text-xs", RATING_COLORS[lead.rating as keyof typeof RATING_COLORS])}>
              {lead.rating}
            </Badge>
          )}
        </div>

        {(lead.email || lead.phone) && (
          <div className="space-y-1">
            {lead.email && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                {lead.email}
              </div>
            )}
            {lead.phone && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {lead.phone}
              </div>
            )}
          </div>
        )}

        {displayValue && (
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            GHS {displayValue.toLocaleString()}
          </div>
        )}

        {lead.source && (
          <Badge variant="secondary" className="text-xs">
            {lead.source}
          </Badge>
        )}

        {lead.status === "qualified" && !lead.convertedToCustomerId && (
          <div className="flex gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs flex-1"
              onClick={handleConvertToCustomer}
              disabled={converting}
            >
              <UserCheck className="h-3 w-3 mr-1" />
              Convert
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs flex-1"
              onClick={handleCreateOpportunity}
              disabled={converting}
            >
              <Briefcase className="h-3 w-3 mr-1" />
              Opportunity
            </Button>
          </div>
        )}

        {lead.status === "converted" && (
          <Badge variant="default" className="text-xs bg-green-600">
            Converted
          </Badge>
        )}
      </div>
    </Card>
  );
}
