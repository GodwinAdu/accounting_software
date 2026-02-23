import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { connectToDB } from "@/lib/connection/mongoose";
import Organization from "@/lib/models/organization.model";
import Customer from "@/lib/models/customer.model";
import Invoice from "@/lib/models/invoice.model";
import Payment from "@/lib/models/payment.model";
import PortalSettings from "@/lib/models/portal-settings.model";
import PortalHeader from "../_components/portal-header";
import PortalInvoicesList from "../_components/portal-invoices-list";
import PortalPaymentHistory from "../_components/portal-payment-history";
import PortalStatement from "../_components/portal-statement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = Promise<{ organizationId: string }>;

export default async function PortalDashboardPage({ params, searchParams }: { params: Props; searchParams: Promise<{ email?: string }> }) {
  const { organizationId } = await params;
  const { email } = await searchParams;

  if (!email) redirect(`/portal/${organizationId}`);

  await connectToDB();
  const organization = await Organization.findById(organizationId);
  const settings = await PortalSettings.findOne({ organizationId });
  const customer = await Customer.findOne({ organizationId, email, del_flag: false });

  if (!organization || !settings?.enabled || !customer) {
    redirect(`/portal/${organizationId}`);
  }

  const invoices = await Invoice.find({ organizationId, customerId: customer._id, del_flag: false })
    .sort({ createdAt: -1 })
    .lean();

  const payments = await Payment.find({ organizationId, customerId: customer._id, del_flag: false })
    .populate("invoiceId", "invoiceNumber")
    .sort({ paymentDate: -1 })
    .lean();

  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.total || inv.totalAmount || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.amountPaid || inv.paidAmount || 0), 0);
  const balance = totalInvoiced - totalPaid;
  const overdueInvoices = invoices.filter(inv => inv.status === "overdue").length;

  await PortalSettings.findOneAndUpdate({ organizationId }, { $inc: { totalVisits: 1 } });

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalHeader organization={JSON.parse(JSON.stringify(organization))} customer={JSON.parse(JSON.stringify(customer))} organizationId={organizationId} />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GHS {totalInvoiced.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{invoices.length} invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">GHS {totalPaid.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{payments.length} payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">GHS {balance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Outstanding</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueInvoices}</div>
              <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            {settings.features?.viewPaymentHistory && (
              <TabsTrigger value="payments">Payment History</TabsTrigger>
            )}
            <TabsTrigger value="statements">Statements</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <PortalInvoicesList invoices={JSON.parse(JSON.stringify(invoices))} settings={JSON.parse(JSON.stringify(settings))} organizationId={organizationId} />
          </TabsContent>

          {settings.features?.viewPaymentHistory && (
            <TabsContent value="payments">
              <PortalPaymentHistory payments={JSON.parse(JSON.stringify(payments))} />
            </TabsContent>
          )}

          <TabsContent value="statements">
            <PortalStatement 
              invoices={JSON.parse(JSON.stringify(invoices))} 
              payments={JSON.parse(JSON.stringify(payments))}
              customer={JSON.parse(JSON.stringify(customer))}
              organization={JSON.parse(JSON.stringify(organization))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
