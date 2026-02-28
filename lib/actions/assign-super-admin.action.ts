"use server";

import { connectToDB } from "../connection/mongoose";
import User from "../models/user.model";
import { clearAllUserCache } from "../helpers/session";

/**
 * Assign super_admin role to a user by email
 */
export async function assignSuperAdminRole(email: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ email, del_flag: false });
    
    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.role === "super_admin") {
      return { success: false, error: "User already has super_admin role" };
    }

    user.role = "super_admin";
    await user.save();

    await clearAllUserCache();

    return { 
      success: true, 
      message: `Super admin role assigned to ${user.fullName} (${user.email})` 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Remove super_admin role from a user by email
 */
export async function removeSuperAdminRole(email: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ email, del_flag: false });
    
    if (!user) {
      return { success: false, error: "User not found" };
    }

    user.role = "user";
    await user.save();

    await clearAllUserCache();

    return { 
      success: true, 
      message: `Super admin role removed from ${user.fullName} (${user.email})` 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
