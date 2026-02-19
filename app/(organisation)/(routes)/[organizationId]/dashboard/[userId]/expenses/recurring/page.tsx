import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getRecurringExpenses } from "@/lib/actions/recurring-expense.action";
import { RecurringExpensesList } from "./_components/recurring-expenses-list";
import Heading from "@/components/commons/Header";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function RecurringExpensesPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("recurringExpenses_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("recurringExpenses_create");

  const result = await getRecurringExpenses();
  const recurringExpenses = result.success ? result.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Recurring Expenses"
        description="Manage recurring and subscription expenses"
      />
      <Separator />
      <RecurringExpensesList recurringExpenses={recurringExpenses} hasCreatePermission={hasCreatePermission} organizationId={organizationId} userId={userId} />
    </div>
  );
}
