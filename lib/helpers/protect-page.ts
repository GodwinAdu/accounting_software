import { redirect } from "next/navigation";
import { checkPermission, checkAnyPermission } from "@/lib/helpers/check-permission";

interface ProtectPageProps {
  permission?: string;
  anyPermissions?: string[];
  redirectTo?: string;
}

export async function protectPage({ 
  permission, 
  anyPermissions, 
  redirectTo = "/" 
}: ProtectPageProps) {
  let hasAccess = false;

  if (permission) {
    hasAccess = await checkPermission(permission);
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = await checkAnyPermission(anyPermissions);
  }

  if (!hasAccess) {
    redirect(redirectTo);
  }
}
