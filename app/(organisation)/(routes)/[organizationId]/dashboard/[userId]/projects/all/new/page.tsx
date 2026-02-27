import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/helpers/check-permission";
import { currentUser } from "@/lib/helpers/session";
import { checkModuleAccess } from "@/lib/helpers/module-access";
import ProjectForm from "./_components/project-form";
import { ProjectBudgetForecast } from "@/components/ai";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function NewProjectPage({ params }: { params: Props }) {
  const { organizationId, userId } = await params;
  const user = await currentUser();
  const hasAIAccess = user ? await checkModuleAccess(user.organizationId, "ai") : false;

  const hasPermission = await checkPermission("projects_create");
  if (!hasPermission) redirect("/unauthorized");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectForm />
        </div>
        {hasAIAccess && (
          <div>
            <ProjectBudgetForecast />
          </div>
        )}
      </div>
    </div>
  );
}
