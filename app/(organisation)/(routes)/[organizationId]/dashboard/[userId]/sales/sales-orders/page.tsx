import { getSalesOrders } from "@/lib/actions/sales-order.action";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";

export default async function SalesOrdersPage({
  params,
}: {
  params:Promise <{ organizationId: string; userId: string }>;
}) {
  const {organizationId, userId} = await params
  const result = await getSalesOrders();
  const orders = result.success ? result.data : [];

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Sales Orders" description="Sell products with inventory tracking"  />
      
        <Link href={`/${organizationId}/dashboard/${userId}/sales/sales-orders/new`}>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            New Sales Order
          </Button>
        </Link>
      </div>
      <Separator />

      <DataTable searchKey="orderNumber" columns={columns} data={orders} />
    </>
  );
}
