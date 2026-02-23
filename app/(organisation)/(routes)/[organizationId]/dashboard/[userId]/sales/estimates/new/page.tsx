import { Separator } from "@/components/ui/separator";
import { EstimateForm } from "./_components/estimate-form";
import Heading from "@/components/commons/Header";
import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getCustomers } from "@/lib/actions/customer.action";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function NewEstimatePage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasCreatePermission = await checkPermission("estimates_create");
  if (!hasCreatePermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const result = await getCustomers();
  const customers = result.success ? result.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Create Estimate"
        description="Generate a new estimate/quote for your customer"
      />
      <Separator />
      <EstimateForm organizationId={organizationId} userId={userId} customers={customers} />
    </div>
  );
}
