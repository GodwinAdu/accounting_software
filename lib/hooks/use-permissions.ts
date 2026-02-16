"use client";

import { useEffect, useState } from "react";

interface UserPermissions {
  [key: string]: boolean;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<UserPermissions>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const response = await fetch("/api/permissions");
        if (response.ok) {
          const data = await response.json();
          setPermissions(data.permissions || {});
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, []);

  const hasPermission = (permission: string): boolean => {
    return permissions[permission] === true;
  };

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some(perm => permissions[perm] === true);
  };

  const hasAllPermissions = (perms: string[]): boolean => {
    return perms.every(perm => permissions[perm] === true);
  };

  return {
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
