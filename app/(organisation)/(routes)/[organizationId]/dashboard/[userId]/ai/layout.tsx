import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import { checkModuleAccess } from "@/lib/helpers/module-access";
import { ReactNode } from "react";

export default async function AILayout({ children, params }: { children: ReactNode; params: Promise<{ organizationId: string; userId: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const hasAIAccess = await checkModuleAccess(String(user.organizationId), "ai");
  if (!hasAIAccess) {
    redirect(`/${organizationId}/dashboard/${userId}`);
  }

  return <>{children}</>;
}
