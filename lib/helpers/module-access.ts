"use server"

import { connectToDB } from "../connection/mongoose";
import Organization from "../models/organization.model";

const moduleCache = new Map<string, { modules: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function checkModuleAccess(organizationId: string, moduleName: string): Promise<boolean> {
  const cacheKey = organizationId;
  const cached = moduleCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.modules?.[moduleName as keyof typeof cached.modules] === true;
  }

  await connectToDB();

  
  const org = await Organization.findById(organizationId).select("modules").lean();
  
  if (org) {
    moduleCache.set(cacheKey, { modules: org.modules, timestamp: Date.now() });
    return org.modules?.[moduleName as keyof typeof org.modules] === true;
  }
  
  return false;
}

export async function invalidateModuleCache(organizationId: string) {
  moduleCache.delete(organizationId);
}

export async function clearModuleCache() {
  moduleCache.clear();
}
