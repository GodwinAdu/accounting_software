import { getCustomers } from "@/lib/actions/customer.action";
import { getEmployees } from "@/lib/actions/employee.action";
import { getSMSCredits } from "@/lib/actions/sms-credit.action";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SMSCampaignForm from "./_components/sms-campaign-form";

export default async function NewSMSCampaignPage({
  params,
}: {
  params: Promise<{ organizationId: string; userId: string }>;
}) {
  const { organizationId, userId } = await params;

  const [customersResult, employeesResult, creditsResult] = await Promise.all([
    getCustomers(),
    getEmployees(),
    getSMSCredits(),
  ]);

  const customers = customersResult.data || [];
  const employees = employeesResult.data || [];
  const credits = creditsResult.data || { balance: 0 };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Link href={`/${organizationId}/dashboard/${userId}/marketing/sms`}>
        <Button variant="ghost" className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to SMS Campaigns
        </Button>
      </Link>
      <SMSCampaignForm
        customers={customers}
        employees={employees}
        organizationId={organizationId}
        userId={userId}
        credits={credits.balance}
      />
    </div>
  );
}
