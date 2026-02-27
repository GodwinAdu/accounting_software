import { currentUserRole } from "./get-user-role";
import { logSecurityEvent } from "./audit";
import { getRequestMetadata } from "./request-metadata";
import { currentUser } from "./session";

export async function checkPermission(permission: string): Promise<boolean> {
  try {
    const userRole = await currentUserRole();
    
    if (!userRole) {
      return false;
    }

    const hasPermission = userRole.permissions?.[permission] === true;
    
    if (!hasPermission) {
      const user = await currentUser();
      const { ipAddress, userAgent } = await getRequestMetadata();
      
      if (user) {
        await logSecurityEvent(
          "permission_denied",
          String(user._id),
          String(user.organizationId),
          { reason: `Missing permission: ${permission}`, ipAddress, userAgent }
        );
      }
    }
    
    return hasPermission;
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
}

export async function checkAnyPermission(permissions: string[]): Promise<boolean> {
  try {
    const userRole = await currentUserRole();
    
    if (!userRole) {
      return false;
    }

    // Check if user has any of the specified permissions
    return permissions.some(permission => userRole.permissions?.[permission] === true);
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}

export async function checkAllPermissions(permissions: string[]): Promise<boolean> {
  try {
    const userRole = await currentUserRole();
    
    if (!userRole) {
      return false;
    }

    // Check if user has all of the specified permissions
    return permissions.every(permission => userRole.permissions?.[permission] === true);
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}

export async function getUserPermissions(): Promise<Record<string, boolean>> {
  try {
    const userRole = await currentUserRole();
    
    if (!userRole) {
      return {};
    }

    return userRole.permissions || {};
  } catch (error) {
    console.error("Error getting user permissions:", error);
    return {};
  }
}

export async function checkAdmin(): Promise<boolean> {
  try {
    const user = await currentUser();
    
    if (!user) {
      return false;
    }

    const isAdmin = user.role === "admin";
    
    if (!isAdmin) {
      const { ipAddress, userAgent } = await getRequestMetadata();
      
      await logSecurityEvent(
        "permission_denied",
        String(user._id),
        String(user.organizationId),
        { reason: "Admin access required", ipAddress, userAgent }
      );
    }
    
    return isAdmin;
  } catch (error) {
    console.error("Error checking admin:", error);
    return false;
  }
}
