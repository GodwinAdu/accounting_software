import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getExpenses } from "@/lib/actions/expense.action";
import { getBills } from "@/lib/actions/bill.action";
import ApprovalsList from "./_components/approvals-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function ApprovalsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("expenseApprovals_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const expensesResult = await getExpenses();
  const billsResult = await getBills();
  
  const expenses = expensesResult.success ? expensesResult.data : [];
  const bills = billsResult.success ? billsResult.data : [];
  
  const pendingExpenses = expenses.filter((e: any) => e.status === "pending");
  const pendingBills = bills.filter((b: any) => b.status === "pending");

  return (
    <div className="space-y-6">
      <Heading title="Approval Workflow" description="Review and approve expenses and bills" />
      <Separator />
      <ApprovalsList pendingExpenses={pendingExpenses} pendingBills={pendingBills} />
    </div>
  );
}
