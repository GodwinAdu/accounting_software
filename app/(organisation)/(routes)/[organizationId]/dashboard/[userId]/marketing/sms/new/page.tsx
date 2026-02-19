import { getCustomers } from "@/lib/actions/customer.action";
import { getEmployees } from "@/lib/actions/employee.action";
import SMSCampaignForm from "./_components/sms-campaign-form";

export default async function NewSMSCampaignPage({
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
      <SMSCampaignForm
        customers={customers}
        employees={employees}
        organizationId={organizationId}
        userId={userId}
      />
    </div>
  );
}
