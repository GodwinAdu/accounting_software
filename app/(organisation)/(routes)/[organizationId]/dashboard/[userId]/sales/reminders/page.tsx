import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getInvoices } from "@/lib/actions/invoice.action";
import PaymentRemindersList from "./_components/payment-reminders-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function PaymentRemindersPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("paymentReminders_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getInvoices();
  const invoices = result.success ? result.data : [];
  const overdueInvoices = invoices.filter((inv: any) => inv.status === "overdue");

  return (
    <div className="space-y-6">
      <Heading title="Payment Reminders" description="Automated reminders for overdue invoices" />
      <Separator />
      <PaymentRemindersList overdueInvoices={overdueInvoices} />
    </div>
  );
}
