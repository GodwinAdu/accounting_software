"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { deleteOpportunity } from "@/lib/actions/opportunity.action";
import { CellAction } from "@/components/table/cell-action";

export type Opportunity = {
  _id: string;
  opportunityNumber: string;
  name: string;
  amount: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
};

const getStageColor = (stage: string) => {
  const colors: Record<string, string> = {
    prospecting: "bg-blue-100 text-blue-700",
    qualification: "bg-yellow-100 text-yellow-700",
    proposal: "bg-orange-100 text-orange-700",
    negotiation: "bg-purple-100 text-purple-700",
    closed_won: "bg-green-100 text-green-700",
    closed_lost: "bg-red-100 text-red-700",
  };
  return colors[stage] || "bg-gray-100 text-gray-700";
};

export const columns: ColumnDef<Opportunity>[] = [
  {
    accessorKey: "opportunityNumber",
    header: "Opportunity #",
    cell: ({ row }) => <div className="font-medium">{row.getValue("opportunityNumber")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "amount",
    header: "Value",
    cell: ({ row }) => {
      const amount = row.getValue<number>("amount");
      return <div className="font-semibold">GHS {amount ? amount.toLocaleString() : '0'}</div>;
    },
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => {
      const stage = row.getValue("stage") as string;
      return <Badge className={getStageColor(stage)}>{stage}</Badge>;
    },
  },
  {
    accessorKey: "probability",
    header: "Probability",
    cell: ({ row }) => {
      const probability = row.getValue<number>("probability");
      return (
        <div className="w-24 space-y-1">
          <div className="text-sm font-medium">{probability}%</div>
          <Progress value={probability} className="h-2" />
        </div>
      );
    },
  },
  {
    accessorKey: "expectedCloseDate",
    header: "Expected Close",
    cell: ({ row }) => {
      const date = row.getValue("expectedCloseDate");
      return date ? new Date(date as string).toLocaleDateString() : "—";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const opportunity = row.original;
      const pathname = usePathname();

      return (
        <CellAction
          data={opportunity}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              permissionKey: "opportunities_update",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "opportunities_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteOpportunity(id, pathname);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
