import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getBudgetById } from "@/lib/actions/budget.action";
import { EditBudgetForm } from "./_components/edit-budget-form";

type Props = Promise<{ organizationId: string; userId: string; budgetId: string }>;

export default async function EditBudgetPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId, budgetId } = await params;

  const hasEditPermission = await checkPermission("budgets_edit");
  if (!hasEditPermission) {
    redirect(`/${organizationId}/dashboard/${userId}/budgeting/annual`);
  }

  const result = await getBudgetById(budgetId);
  if (!result.success || !result.data) {
    redirect(`/${organizationId}/dashboard/${userId}/budgeting/annual`);
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <EditBudgetForm budget={result.data} />
    </div>
  );
}
