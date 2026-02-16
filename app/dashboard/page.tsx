import { redirect } from "next/navigation";
import { currentUser } from "@/lib/helpers/session";

export default async function DashboardPage() {
  const user = await currentUser();

  console.log("[DASHBOARD REDIRECT] User:", JSON.stringify(user, null, 2));

  if (!user) {
    console.log("[DASHBOARD REDIRECT] No user, redirecting to sign-in");
    redirect("/sign-in");
  }

  const organizationId = user.organizationId || user.organization;
  const userId = user.id || user._id;

  console.log("[DASHBOARD REDIRECT] organizationId:", organizationId);
  console.log("[DASHBOARD REDIRECT] userId:", userId);

  if (!organizationId || !userId) {
    console.error("[DASHBOARD REDIRECT] Missing organizationId or userId", { user });
    redirect("/sign-in");
  }

  const targetUrl = `/${organizationId}/dashboard/${userId}`;
  console.log("[DASHBOARD REDIRECT] Redirecting to:", targetUrl);
  
  redirect(targetUrl);
}
