import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/helpers/check-permission";
import ProjectForm from "./_components/project-form";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function NewProjectPage({ params }: { params: Props }) {
  const { organizationId, userId } = await params;

  const hasPermission = await checkPermission("projects_create");
  if (!hasPermission) redirect("/unauthorized");

  return (
    <div className="space-y-6">
      <ProjectForm />
    </div>
  );
}
