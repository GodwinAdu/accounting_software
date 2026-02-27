// lib/helpers/permission-helpers.ts

import { currentUserRole } from "./get-user-role";

/**
 * Check if user has permission for a resource action
 * @param resource - Resource name (e.g., "invoices", "expenses")
 * @param action - Action type ("create", "view", "update", "delete")
 */
export async function hasResourcePermission(
  resource: string,
  action: "create" | "view" | "update" | "delete"
): Promise<boolean> {
  const role = await currentUserRole();
  if (!role) return false;
  
  const permissionKey = `${resource}_${action}`;
  return role.permissions?.[permissionKey] === true;
}

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(permissions: string[]): Promise<boolean> {
  const role = await currentUserRole();
  if (!role) return false;
  
  return permissions.some(perm => role.permissions?.[perm] === true);
}

/**
 * Check if user has all of the specified permissions
 */
export async function hasAllPermissions(permissions: string[]): Promise<boolean> {
  const role = await currentUserRole();
  if (!role) return false;
  
  return permissions.every(perm => role.permissions?.[perm] === true);
}

/**
 * Check if user has module access
 * @param module - Module name (e.g., "banking", "sales", "accounting")
 */
export async function hasModuleAccess(module: string): Promise<boolean> {
  const role = await currentUserRole();
  if (!role) return false;
  
  const modulePermission = `${module}_view`;
  return role.permissions?.[modulePermission] === true;
}

/**
 * Get all permissions for current user
 */
export async function getUserPermissions(): Promise<Record<string, boolean>> {
  const role = await currentUserRole();
  return role?.permissions || {};
}

/**
 * Check if user is admin (has all permissions)
 */
export async function isAdmin(): Promise<boolean> {
  const role = await currentUserRole();
  if (!role) return false;
  
  // Check if role name is admin or has all critical permissions
  return role.name === "admin" || role.name === "owner";
}

/**
 * Get user's accessible modules
 */
export async function getAccessibleModules(): Promise<string[]> {
  const role = await currentUserRole();
  if (!role) return [];
  
  const modules = [
    "dashboard", "banking", "sales", "expenses", "payroll", 
    "accounting", "tax", "products", "reports", "settings",
    "projects", "crm", "budgeting", "assets", "equity", "ai"
  ];
  
  return modules.filter(module => {
    const permissionKey = `${module}_view`;
    return role.permissions?.[permissionKey] === true;
  });
}

/**
 * Check CRUD permissions for a resource
 */
export async function getResourcePermissions(resource: string) {
  const role = await currentUserRole();
  if (!role) {
    return { create: false, view: false, update: false, delete: false };
  }
  
  return {
    create: role.permissions?.[`${resource}_create`] === true,
    view: role.permissions?.[`${resource}_view`] === true,
    update: role.permissions?.[`${resource}_update`] === true,
    delete: role.permissions?.[`${resource}_delete`] === true,
  };
}
