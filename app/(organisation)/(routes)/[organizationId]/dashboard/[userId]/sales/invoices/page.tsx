import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import InvoicesList from "./_components/invoices-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function InvoicesPage({ params }: { params: Props }) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { organizationId, userId } = await params;

  return (
    <div className="space-y-6">
      <Heading
        title="Invoices"
        description="Create and manage customer invoices"
      />
      <Separator />
      <InvoicesList organizationId={organizationId} userId={userId} />
    </div>
  );
}
