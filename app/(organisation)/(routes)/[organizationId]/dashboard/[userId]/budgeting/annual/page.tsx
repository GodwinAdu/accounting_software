import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getAllBudgets } from "@/lib/actions/budget.action";
import AnnualBudgetClient from "./_components/annual-budget-client";
import { BudgetSuggestion } from "@/components/ai";
import { checkModuleAccess } from "@/lib/helpers/module-access";

type Props = Promise<{ organizationId: string; userId: string }>;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AnnualBudgetPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("budgeting_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const hasCreatePermission = await checkPermission("budgets_create");
  const hasAIAccess = await checkModuleAccess(user.organizationId, "ai");

  const result = await getAllBudgets();
  const budgets = result.success ? (result.budgets || []) : [];

  return (
    <div className="space-y-6">
      <Heading title="Annual Budget" description="Create and manage annual budgets" />
      <Separator />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <AnnualBudgetClient budgets={budgets} hasCreatePermission={hasCreatePermission} />
        </div>
        {hasAIAccess && (
          <div>
            <BudgetSuggestion />
          </div>
        )}
      </div>
    </div>
  );
}
