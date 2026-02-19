import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getExpenses, getExpenseSummary } from "@/lib/actions/expense.action";
import { ExpensesList } from "./_components/expenses-list";
import Heading from "@/components/commons/Header";

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
      <ExpensesList expenses={expenses} summary={summary} hasCreatePermission={hasCreatePermission} />
    </div>
  );
}
