"use server";

import { connectToDB } from "@/lib/connection/mongoose";
import User from "@/lib/models/user.model";
import { currentUser } from "@/lib/helpers/session";
import * as speakeasy from "speakeasy";
import { revalidatePath } from "next/cache";

export async function enable2FAForLogin(email: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ email });
    if (!user) return { success: false, error: "User not found" };

    const secret = speakeasy.generateSecret({
      name: `SyncBooks (${user.email})`,
      issuer: "SyncBooks",
    });

    await User.findByIdAndUpdate(user._id, {
      twoFactorSecret: secret.base32,
    });

    return {
      success: true,
      data: {
        secret: secret.base32,
        qrCode: secret.otpauth_url,
      },
    };
  } catch (error: any) {
    console.error("Enable 2FA for login error:", error);
    return { success: false, error: error.message };
  }
}

export async function verify2FASetupForLogin(email: string, token: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ email });
    if (!user || !user.twoFactorSecret) {
      return { success: false, error: "2FA setup not initiated" };
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 2,
    });

    if (!verified) {
      return { success: false, error: "Invalid verification code" };
    }

    await User.findByIdAndUpdate(user._id, {
      twoFactorAuthEnabled: true,
    });

    return { success: true, message: "2FA enabled successfully" };
  } catch (error: any) {
    console.error("Verify 2FA setup for login error:", error);
    return { success: false, error: error.message };
  }
}

export async function enable2FA() {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await connectToDB();

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `SyncBooks: ${user.email}`,
      issuer: "SyncBooks",
    });

    // Store temporary secret (will be confirmed after verification)
    await User.findByIdAndUpdate(user._id, {
      twoFactorSecret: secret.base32,
    });

    return {
      success: true,
      data: {
        secret: secret.base32,
        qrCode: secret.otpauth_url,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function verify2FASetup(token: string, pathname: string) {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await connectToDB();

    const dbUser = await User.findById(user._id);
    if (!dbUser || !dbUser.twoFactorSecret) {
      return { success: false, error: "2FA setup not initiated" };
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: dbUser.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 2,
    });

    if (!verified) {
      return { success: false, error: "Invalid verification code" };
    }

    // Enable 2FA
    await User.findByIdAndUpdate(user._id, {
      twoFactorAuthEnabled: true,
    });

    revalidatePath(pathname);

    return { success: true, message: "2FA enabled successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function disable2FA(pathname: string) {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await connectToDB();

    await User.findByIdAndUpdate(user._id, {
      twoFactorAuthEnabled: false,
      twoFactorSecret: null,
    });

    revalidatePath(pathname);

    return { success: true, message: "2FA disabled successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function verify2FALogin(email: string, token: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ email });
    if (!user || !user.twoFactorAuthEnabled || !user.twoFactorSecret) {
      return { success: false, error: "2FA not enabled for this user" };
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
      window: 2,
    });

    if (!verified) {
      return { success: false, error: "Invalid verification code" };
    }

    return { success: true, message: "2FA verification successful" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
