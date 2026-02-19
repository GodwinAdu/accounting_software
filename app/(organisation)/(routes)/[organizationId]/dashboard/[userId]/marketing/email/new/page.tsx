import { getCustomers } from "@/lib/actions/customer.action";
import { getEmployees } from "@/lib/actions/employee.action";
import EmailCampaignForm from "./_components/email-campaign-form";

export default async function NewEmailCampaignPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const [customersResult, employeesResult] = await Promise.all([
    getCustomers(),
    getEmployees(),
  ]);

  const customers = customersResult.data || [];
  const employees = employeesResult.data || [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <EmailCampaignForm
        customers={customers}
        employees={employees}
        organizationId={organizationId}
        userId={userId}
      />
    </div>
  );
}
