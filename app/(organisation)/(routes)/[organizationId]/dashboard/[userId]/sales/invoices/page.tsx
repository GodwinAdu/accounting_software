import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getInvoices, getInvoiceSummary } from "@/lib/actions/invoice.action";
import InvoicesList from "./_components/invoices-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function InvoicesPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("invoices_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("invoices_create");

  const [invoicesResult, summaryResult] = await Promise.all([
    getInvoices(),
    getInvoiceSummary(),
  ]);

  const invoices = invoicesResult.success ? invoicesResult.data : [];
  const summary = summaryResult.success ? summaryResult.data : {
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    outstanding: 0,
    overdue: 0,
  };

  return (
    <div className="space-y-6">
      <Heading
        title="Invoices"
        description="Create and manage customer invoices"
      />
      <Separator />
      <InvoicesList invoices={invoices} summary={summary} hasCreatePermission={hasCreatePermission} organizationId={organizationId} userId={userId} />
    </div>
  );
}
