import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getCustomers } from "@/lib/actions/customer.action";
import CustomersList from "./_components/customers-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function CustomersPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("customers_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("customers_create");

  const result = await getCustomers();
  const customers = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <Heading
        title="Customers"
        description="Manage your customer database"
      />
      <Separator />
      <CustomersList customers={customers} hasCreatePermission={hasCreatePermission} organizationId={organizationId} userId={userId} />
    </div>
  );
}
