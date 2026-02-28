"use server";

import { clearRoleCache } from "../helpers/get-user-role";
import { clearAllUserCache } from "../helpers/session";

export async function clearRole() {
  try {
    await clearAllUserCache();
    await clearRoleCache()
    console.log("Cleared all user cache");
    return { success: true, message: "Role cache cleared successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
