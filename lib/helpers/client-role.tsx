"use client"

import { useRole } from "@/contexts/role-context";


const useClientRole = () => {
  return useRole();
};

export default useClientRole;