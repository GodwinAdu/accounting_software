import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import PageTemplate from "@/components/commons/PageTemplate";
import { RefreshCw } from "lucide-react";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function RecurringInvoicesPage({ params }: { params: Props }) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return <PageTemplate title="Recurring Invoices" description="Set up and manage recurring invoices" icon={<RefreshCw className="h-8 w-8" />} />;
}
