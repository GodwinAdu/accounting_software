import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { connectToDB } from "@/lib/connection/mongoose";
import Organization from "@/lib/models/organization.model";
import Vendor from "@/lib/models/vendor.model";
import Bill from "@/lib/models/bill.model";
import PurchaseOrder from "@/lib/models/purchase-order.model";
import VendorHeader from "../_components/vendor-header";
import VendorBillsList from "../_components/vendor-bills-list";
import VendorPurchaseOrders from "../_components/vendor-purchase-orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = Promise<{ organizationId: string }>;

export default async function VendorDashboardPage({ params, searchParams }: { params: Props; searchParams: Promise<{ email?: string }> }) {
  const { organizationId } = await params;
  const { email } = await searchParams;

  if (!email) redirect(`/vendor-portal/${organizationId}`);

  await connectToDB();
  const organization = await Organization.findById(organizationId);
  const vendor = await Vendor.findOne({ organizationId, email, del_flag: false });

  if (!organization || !vendor) {
    redirect(`/vendor-portal/${organizationId}`);
  }

  const bills = await Bill.find({ organizationId, vendorId: vendor._id, del_flag: false })
    .sort({ createdAt: -1 })
    .lean();

  const purchaseOrders = await PurchaseOrder.find({ organizationId, vendorId: vendor._id, del_flag: false })
    .sort({ createdAt: -1 })
    .lean();

  const totalBilled = bills.reduce((sum, bill) => sum + bill.total, 0);
  const totalPaid = bills.reduce((sum, bill) => sum + bill.amountPaid, 0);
  const balance = totalBilled - totalPaid;
  const pendingPOs = purchaseOrders.filter(po => po.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorHeader organization={JSON.parse(JSON.stringify(organization))} vendor={JSON.parse(JSON.stringify(vendor))} organizationId={organizationId} />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GHS {totalBilled.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{bills.length} bills</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">GHS {totalPaid.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">GHS {balance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchaseOrders.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{pendingPOs} pending</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bills" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="submit">Submit Bill</TabsTrigger>
          </TabsList>

          <TabsContent value="bills">
            <VendorBillsList bills={JSON.parse(JSON.stringify(bills))} />
          </TabsContent>

          <TabsContent value="purchase-orders">
            <VendorPurchaseOrders purchaseOrders={JSON.parse(JSON.stringify(purchaseOrders))} />
          </TabsContent>

          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Bill</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Bill submission form coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
