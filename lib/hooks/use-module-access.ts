"use client";

import { useState, useEffect } from "react";

export function useModuleAccess(moduleName: string) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch(`/api/module-access?module=${moduleName}`);
        const data = await response.json();
        setHasAccess(data.hasAccess || false);
      } catch (error) {
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    }
    checkAccess();
  }, [moduleName]);

  return { hasAccess, loading };
}
