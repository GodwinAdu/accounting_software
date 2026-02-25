"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { deleteFixedAsset } from "@/lib/actions/fixed-asset.action";
import { CellAction } from "@/components/table/cell-action";

export type FixedAsset = {
  _id: string;
  assetNumber: string;
  assetName: string;
  category: "building" | "equipment" | "vehicle" | "furniture" | "computer" | "land" | "other";
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  accumulatedDepreciation: number;
  status: "active" | "disposed" | "fully_depreciated";
};

export const columns: ColumnDef<FixedAsset>[] = [
  {
    accessorKey: "assetNumber",
    header: "Asset #",
    cell: ({ row }) => {
      return <div className="font-mono font-semibold">{row.getValue("assetNumber")}</div>;
    },
  },
  {
    accessorKey: "assetName",
    header: "Asset Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const categoryConfig = {
        building: "Building",
        equipment: "Equipment",
        vehicle: "Vehicle",
        furniture: "Furniture",
        computer: "Computer",
        land: "Land",
        other: "Other",
      };
      return <Badge variant="outline">{categoryConfig[category as keyof typeof categoryConfig]}</Badge>;
    },
  },
  {
    accessorKey: "purchaseDate",
    header: "Purchase Date",
    cell: ({ row }) => {
      return new Date(row.getValue("purchaseDate")).toLocaleDateString();
    },
  },
  {
    accessorKey: "purchasePrice",
    header: "Purchase Price",
    cell: ({ row }) => {
      return <div className="font-semibold">GHS {row.getValue<number>("purchasePrice").toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "accumulatedDepreciation",
    header: "Depreciation",
    cell: ({ row }) => {
      return <div className="text-red-600">GHS {row.getValue<number>("accumulatedDepreciation").toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "currentValue",
    header: "Current Value",
    cell: ({ row }) => {
      return <div className="font-semibold">GHS {row.getValue<number>("currentValue").toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
        disposed: { label: "Disposed", className: "bg-gray-100 text-gray-700" },
        fully_depreciated: { label: "Fully Depreciated", className: "bg-amber-100 text-amber-700" },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return <Badge className={config.className}>{config.label}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const asset = row.original;
      const pathname = usePathname();

      return (
        <CellAction
          data={asset}
          actions={[
            {
              label: "Edit",
              type: "edit",
              icon: <Edit className="h-4 w-4" />,
              href: `${pathname}/${asset._id}`,
              permissionKey: "assets_edit",
            },
            {
              label: "Delete",
              type: "delete",
              icon: <Trash2 className="h-4 w-4" />,
              permissionKey: "assets_delete",
            },
          ]}
          onDelete={async (id) => {
            const result = await deleteFixedAsset(id);
            if (result.error) throw new Error(result.error);
          }}
        />
      );
    },
  },
];
