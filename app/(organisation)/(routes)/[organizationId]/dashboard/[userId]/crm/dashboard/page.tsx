import { Separator } from "@/components/ui/separator";
import Heading from "@/components/commons/Header";
import { CustomerSegmentation } from "@/components/ai";
import { checkModuleAccess } from "@/lib/helpers/module-access";
import { currentUser } from "@/lib/helpers/session";

export default async function CRMDashboardPage() {
  const user = await currentUser();
  const hasAIAccess = await checkModuleAccess(user?.organizationId!, "ai");

  return (
    <div className="space-y-6">
      <Heading title="CRM Insights" description="AI-powered customer analysis" />
      <Separator />
      
      {hasAIAccess ? (
        <CustomerSegmentation />
      ) : (
        <p className="text-muted-foreground">Enable AI module to access customer insights</p>
      )}
    </div>
  );
}
