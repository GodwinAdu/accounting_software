import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertTriangle, Package, TrendingDown } from "lucide-react";
import { connectToDB } from "@/lib/connection/mongoose";
import ProductBatch from "@/lib/models/product-batch.model";
import { format, differenceInDays } from "date-fns";
import AddBatchDialog from "./_components/add-batch-dialog";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function BatchExpiryPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("batchExpiry_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  await connectToDB();
  
  const batches = await ProductBatch.find({ 
    organizationId, 
    del_flag: false,
    status: "active"
  }).populate("productId", "name").sort({ expiryDate: 1 }).lean();

  const today = new Date();
  const expiredBatches = batches.filter(b => differenceInDays(b.expiryDate, today) < 0).length;
  const expiringIn7Days = batches.filter(b => {
    const days = differenceInDays(b.expiryDate, today);
    return days >= 0 && days <= 7;
  }).length;
  const expiringIn30Days = batches.filter(b => {
    const days = differenceInDays(b.expiryDate, today);
    return days > 7 && days <= 30;
  }).length;

  const getStatusColor = (expiryDate: Date) => {
    const days = differenceInDays(expiryDate, today);
    if (days < 0) return "destructive";
    if (days <= 7) return "destructive";
    if (days <= 30) return "secondary";
    return "outline";
  };

  const getStatusLabel = (expiryDate: Date) => {
    const days = differenceInDays(expiryDate, today);
    if (days < 0) return "Expired";
    if (days <= 7) return "Critical";
    if (days <= 30) return "Warning";
    return "Good";
  };

  return (
    <div className="space-y-6">
      <Heading title="Batch & Expiry Tracking" description="Track product batches and expiry dates" />
      <Separator />
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active batches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredBatches}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs removal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring in 7 Days</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringIn7Days}</div>
            <p className="text-xs text-muted-foreground mt-1">Critical</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring in 30 Days</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expiringIn30Days}</div>
            <p className="text-xs text-muted-foreground mt-1">Monitor</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Batch Tracking</CardTitle>
          <AddBatchDialog />
        </CardHeader>
        <CardContent>
          {batches.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No batches tracked</p>
              <p className="text-sm text-muted-foreground mt-2">Start tracking batches to monitor expiry dates</p>
            </div>
          ) : (
            <div className="space-y-3">
              {batches.map((batch: any) => {
                const daysUntilExpiry = differenceInDays(new Date(batch.expiryDate), today);
                return (
                  <div key={batch._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{batch.productId?.name || "Unknown Product"}</p>
                        <p className="text-sm text-muted-foreground">Batch: {batch.batchNumber} • Qty: {batch.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{format(new Date(batch.expiryDate), "MMM dd, yyyy")}</p>
                        <p className="text-xs text-muted-foreground">
                          {daysUntilExpiry < 0 ? "Expired" : `${daysUntilExpiry} days left`}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(new Date(batch.expiryDate)) as any}>
                        {getStatusLabel(new Date(batch.expiryDate))}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
