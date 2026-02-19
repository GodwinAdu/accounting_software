import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Package, CheckCircle, Clock } from "lucide-react";
import { connectToDB } from "@/lib/connection/mongoose";
import StockTransfer from "@/lib/models/stock-transfer.model";
import { format } from "date-fns";
import NewTransferDialog from "./_components/new-transfer-dialog";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function StockTransferPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("stockTransfer_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  await connectToDB();
  
  const transfers = await StockTransfer.find({ 
    organizationId, 
    del_flag: false 
  })
  .populate("productId", "name")
  .populate("fromWarehouseId", "name")
  .populate("toWarehouseId", "name")
  .populate("requestedBy", "fullName")
  .sort({ createdAt: -1 })
  .lean();

  const pendingTransfers = transfers.filter(t => t.status === "pending").length;
  const inTransitTransfers = transfers.filter(t => t.status === "in-transit").length;
  const completedTransfers = transfers.filter(t => t.status === "completed").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in-transit": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "in-transit": return <ArrowLeftRight className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Heading title="Stock Transfer" description="Transfer inventory between warehouses" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transfers</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transfers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingTransfers}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inTransitTransfers}</div>
            <p className="text-xs text-muted-foreground mt-1">On the way</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{completedTransfers}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transfer History</CardTitle>
          <NewTransferDialog />
        </CardHeader>
        <CardContent>
          {transfers.length === 0 ? (
            <div className="text-center py-12">
              <ArrowLeftRight className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No transfers recorded</p>
              <p className="text-sm text-muted-foreground mt-2">Create your first stock transfer</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transfers.map((transfer: any) => (
                <div key={transfer._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(transfer.status)}
                    <div>
                      <p className="font-medium">{transfer.productId?.name || "Unknown Product"}</p>
                      <p className="text-sm text-muted-foreground">
                        {transfer.fromWarehouseId?.name || "Unknown"} → {transfer.toWarehouseId?.name || "Unknown"} • Qty: {transfer.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested by {transfer.requestedBy?.fullName || "Unknown"} • {format(new Date(transfer.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusColor(transfer.status) as any}>
                      {transfer.status.replace("-", " ").toUpperCase()}
                    </Badge>
                    {transfer.status === "pending" && (
                      <Button size="sm" variant="outline">Approve</Button>
                    )}
                    {transfer.status === "in-transit" && (
                      <Button size="sm" variant="outline">Receive</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
