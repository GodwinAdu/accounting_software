import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getExpenses } from "@/lib/actions/expense.action";
import { getBills } from "@/lib/actions/bill.action";
import ApprovalsList from "./_components/approvals-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckSquare } from "lucide-react";

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
      
      <Alert className="border-green-200 bg-green-50">
        <CheckSquare className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900 font-semibold">Approval Process</AlertTitle>
        <AlertDescription className="text-green-800 mt-2">
          <div className="space-y-1 text-sm">
            <p><span className="font-semibold">Review:</span> Check expense details, receipts, and amounts for accuracy</p>
            <p><span className="font-semibold">Approve:</span> Approved items will be posted to accounting records</p>
            <p><span className="font-semibold">Reject:</span> Rejected items return to submitter with your comments</p>
            <p className="text-amber-700 font-semibold mt-2">⚠️ Once approved, expenses cannot be edited - only reversed</p>
          </div>
        </AlertDescription>
      </Alert>

      <ApprovalsList pendingExpenses={pendingExpenses} pendingBills={pendingBills} />
    </div>
  );
}
