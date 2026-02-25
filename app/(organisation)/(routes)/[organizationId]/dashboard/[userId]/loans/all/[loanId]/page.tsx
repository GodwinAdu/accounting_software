import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getLoanById } from "@/lib/actions/loan.action";
import { generateAmortizationSchedule } from "@/lib/helpers/loan-payment";
import LoanDetailClient from "./_components/loan-detail-client";

type Props = Promise<{ organizationId: string; userId: string; loanId: string }>;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LoanDetailPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId, loanId } = await params;

  const hasViewPermission = await checkPermission("loans_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const result = await getLoanById(loanId);
  if (!result.success || !result.data) {
    redirect(`/${organizationId}/dashboard/${userId}/loans/all`);
  }

  const loan = result.data;
  const schedule = generateAmortizationSchedule(
    loan.principalAmount,
    loan.interestRate,
    loan.loanTerm,
    new Date(loan.startDate)
  );

  return (
    <div className="space-y-6">
      <Heading title={loan.loanName} description={`Loan #${loan.loanNumber}`} />
      <Separator />
      <LoanDetailClient loan={loan} schedule={schedule} />
    </div>
  );
}
