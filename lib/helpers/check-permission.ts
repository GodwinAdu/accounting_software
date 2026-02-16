import { currentUserRole } from "./get-user-role";

export async function checkPermission(permission: string): Promise<boolean> {
  try {
    const userRole = await currentUserRole();
    
    if (!userRole) {
      return false;
    }

    // Check if user has the specific permission
    return userRole.permissions?.[permission] === true;
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
