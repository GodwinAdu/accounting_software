import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getBankRules } from "@/lib/actions/bank-rule.action";
import BankRulesList from "./_components/bank-rules-list";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function BankRulesPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasViewPermission = await checkPermission("bankRules_view");
  if (!hasViewPermission) redirect(`/${organizationId}/dashboard/${userId}`);

  const hasCreatePermission = await checkPermission("bankRules_create");

  const result = await getBankRules();
  const rules = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <Heading title="Bank Rules" description="Automate transaction categorization with smart rules" />
      <Separator />
      <BankRulesList rules={rules} hasCreatePermission={hasCreatePermission} />
    </div>
  );
}
