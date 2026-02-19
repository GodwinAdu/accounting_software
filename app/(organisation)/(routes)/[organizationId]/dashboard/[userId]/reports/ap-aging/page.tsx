import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./_components/columns";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { getAPAgingReport } from "@/lib/actions/report.action";
import { checkPermission } from "@/lib/helpers/check-permission";
import { redirect } from "next/navigation";

export default async function APAgingPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("reports_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getAPAgingReport();
  const data = result.data || [];

  const totals = data.reduce((acc: any, item: any) => ({
    current: acc.current + item.current,
    days30: acc.days30 + item.days30,
    days60: acc.days60 + item.days60,
    days90: acc.days90 + item.days90,
    over90: acc.over90 + item.over90,
    total: acc.total + item.total,
  }), { current: 0, days30: 0, days60: 0, days90: 0, over90: 0, total: 0 });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Accounts Payable Aging"
          description="Vendor outstanding balances by age"
        />
        <div className="flex gap-3">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Separator />

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Current</p>
            <p className="text-xl font-bold text-emerald-600">GHS {totals.current.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">1-30 Days</p>
            <p className="text-xl font-bold text-blue-600">GHS {totals.days30.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">31-60 Days</p>
            <p className="text-xl font-bold text-yellow-600">GHS {totals.days60.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">61-90 Days</p>
            <p className="text-xl font-bold text-orange-600">GHS {totals.days90.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-medium text-muted-foreground">Over 90 Days</p>
            <p className="text-xl font-bold text-red-600">GHS {totals.over90.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={data} />

      <div className="rounded-lg border bg-red-50 p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">Total Accounts Payable</span>
          <span className="text-2xl font-bold text-red-600">GHS {totals.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
