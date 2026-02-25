import { redirect } from "next/navigation";
import { checkPermission } from "@/lib/helpers/check-permission";
import { getProjectById } from "@/lib/actions/project-crud.action";
import { getProjectTasks } from "@/lib/actions/project-task.action";
import { getProjectTransactions } from "@/lib/actions/project-transactions.action";
import ProjectDetailClient from "./_components/project-detail-client";



type Props = Promise<{ organizationId: string; userId: string; projectId: string }>;

export default async function ProjectDetailPage({ params }: { params: Props }) {
  const { organizationId, userId, projectId } = await params;

  const hasPermission = await checkPermission("projects_view");
  if (!hasPermission) redirect("/unauthorized");

  const projectResult = await getProjectById(projectId);
  const tasksResult = await getProjectTasks(projectId);
  const transactionsResult = await getProjectTransactions(projectId);

  if (projectResult.error) {
    redirect(`/${organizationId}/dashboard/${userId}/projects/all`);
  }

  return (
    <ProjectDetailClient
      project={projectResult.data}
      tasks={tasksResult.data || []}
      invoices={transactionsResult.data?.invoices || []}
      expenses={transactionsResult.data?.expenses || []}
      organizationId={organizationId}
      userId={userId}
    />
  );
}
