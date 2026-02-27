import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getCustomers } from "@/lib/actions/customer.action";
import CustomersList from "./_components/customers-list";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users } from "lucide-react";

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
      
      <Alert className="border-blue-200 bg-blue-50">
        <Users className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <span className="font-semibold">Customer Management:</span> Store contact details, set credit limits, and define payment terms. Complete customer profiles enable faster invoicing and better relationship management.
        </AlertDescription>
      </Alert>

      <CustomersList customers={customers} hasCreatePermission={hasCreatePermission} organizationId={organizationId} userId={userId} />
    </div>
  );
}
