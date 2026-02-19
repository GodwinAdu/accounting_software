import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getRecurringInvoices } from "@/lib/actions/recurring-invoice.action";
import { RecurringInvoicesList } from "./_components/recurring-invoices-list";
import Heading from "@/components/commons/Header";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function RecurringInvoicesPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("recurringInvoices_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("recurringInvoices_create");

  const result = await getRecurringInvoices();
  const recurringInvoices = result.success ? result.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Recurring Invoices"
        description="Set up and manage recurring invoices"
      />
      <Separator />
      <RecurringInvoicesList recurringInvoices={recurringInvoices} hasCreatePermission={hasCreatePermission} organizationId={organizationId} userId={userId} />
    </div>
  );
}
