import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getExpenseCategories } from "@/lib/actions/expense-category.action";
import { CategoriesList } from "./_components/categories-list";
import Heading from "@/components/commons/Header";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function CategoriesPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("expenseCategories_view");
  if (!hasViewPermission) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  const hasCreatePermission = await checkPermission("expenseCategories_create");

  const result = await getExpenseCategories();
  const categories = result.success ? result.data : [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Heading
        title="Expense Categories"
        description="Organize and manage expense categories"
      />
      <Separator />
      <CategoriesList categories={categories} hasCreatePermission={hasCreatePermission} />
    </div>
  );
}
