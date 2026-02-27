import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getExpenses, getExpenseSummary } from "@/lib/actions/expense.action";
import { ExpensesList } from "./_components/expenses-list";
import Heading from "@/components/commons/Header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function AllExpensesPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("expenses_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("expenses_create");

  const [expensesResult, summaryResult] = await Promise.all([
    getExpenses(),
    getExpenseSummary(),
  ]);

  const expenses = expensesResult.success ? expensesResult.data : [];
  const summary = summaryResult.success ? summaryResult.data : {
    totalExpenses: 0,
    totalAmount: 0,
    pending: 0,
    paid: 0
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="All Expenses"
        description="Track and manage all business expenses"
      />
      <Separator />
      
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900 font-semibold">Expense Management Guide</AlertTitle>
        <AlertDescription className="text-blue-800 mt-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><span className="font-semibold">Attach receipts</span> for audit compliance and tax deductions</li>
            <li><span className="font-semibold">Reimbursable expenses</span> will be tracked for employee reimbursement</li>
            <li><span className="font-semibold">Approval workflow</span> - pending expenses require manager approval before posting</li>
            <li><span className="font-semibold">Categories</span> help organize expenses for reporting and tax purposes</li>
          </ul>
        </AlertDescription>
      </Alert>

      <ExpensesList expenses={expenses} summary={summary} hasCreatePermission={hasCreatePermission} />
    </div>
  );
}
