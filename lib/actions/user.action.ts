"use server";

import { compare, hash } from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import * as jwt from 'jsonwebtoken';
import * as speakeasy from "speakeasy";
import { connectToDB } from "../connection/mongoose";
import { issueRefreshToken, signAccessToken } from "../helpers/jwt";
import { smsConfig } from "@/services/sms-config";
import User from "../models/user.model";
import { withAuth, type User as UserType } from "../helpers/auth"
import { logAudit } from "../helpers/audit"
import { checkWriteAccess } from "../helpers/check-write-access"
import Department from "../models/deparment.model"
import mongoose from "mongoose"


interface RegisterData {
    email: string;
    password: string;
    name: string;
    phone: string;
}

// export async function registerUser(
//     data: RegisterData
// ): Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean; email?: string }> {
//     try {
//         const { email, password, name, phone } = data;

//         await connectToDB();

//         const existing = await User.findOne({ $or: [{ email }, { phone }] });
//         if (existing) {
//             return { success: false, error: "User with this email or phone already exists" };
//         }

//         const passwordHash = await hash(password, 12);

//         // Generate 6-digit verification code
//         const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
//         const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//         const newUser = await User.create({
//             email,
//             fullName: name,
//             phone,
//             passwordHash,
//             mfa: {
//                 enabled: false,
//                 backupCodes: [],
//                 method: "totp",
//             },
//             emailVerified: false,
//             phoneVerified: false,
//             loginAttempts: 0,
//             metadata: {},
//             emailVerificationCode: verificationCode,
//             emailVerificationExpires: verificationExpires,
//         });

//         // Send verification email
//         await sendEmail({
//             to: email,
//             subject: "Verify your email address",
//             html: `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                     <h2>Welcome to AI Agent Platform!</h2>
//                     <p>Hi ${name},</p>
//                     <p>Thank you for signing up. Please verify your email address using the code below:</p>
//                     <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
//                         <h1 style="color: #333; font-size: 32px; letter-spacing: 5px; margin: 0;">${verificationCode}</h1>
//                     </div>
//                     <p>This code will expire in 10 minutes.</p>
//                     <p>If you didn't create an account, please ignore this email.</p>
//                 </div>
//             `
//         });

//         await Subscription.create({
//             userId: newUser._id,
//             planId: "free",
//             planName: "Free Plan",
//             status: "active",
//             currentPeriodStart: new Date(),
//             currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days,
//         });

//         return { success: true, requiresEmailVerification: true, email };
//     } catch (error) {
//         console.error("Error registering User:", error);
//         return { success: false, error: "Internal server error" };
//     }
// }


interface LoginParams {
    email: string;
    password: string;
    mfaToken?: string;
    isBackupCode?: boolean;
    ip?: string;
    userAgent?: string;
}

export async function loginUser(data: LoginParams) {
    try {
        const { email, password, mfaToken } = data;

        await connectToDB();

        const user = await User.findOne({ email }).populate('organizationId');
      
        if (!user || !user.password) {
            return { success: false, error: "Invalid credentials" };
        }

        if (user.suspended) {
            return { success: false, error: "Account is suspended" };
        }

        const ok = await compare(password, user.password);
       
        if (!ok) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 5) {
                user.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000);
            }
            await user.save();
            return { success: false, error: "Invalid credentials" };
        }

        // Check if organization requires 2FA but user hasn't enabled it yet
        const organization = user.organizationId as any;
        if (organization?.security?.twoFactorRequired && !user.twoFactorAuthEnabled) {
            return { 
                success: true,
                requiresMFASetup: true,
                userId: user.id,
                email: user.email,
                message: "Your organization requires two-factor authentication. Please set up 2FA to continue."
            };
        }

        if (user.twoFactorAuthEnabled && !mfaToken) {
            const tempToken = jwt.sign(
                { userId: user.id, email: user.email, type: 'mfa' },
                process.env.JWT_ACCESS_SECRET!,
                { expiresIn: '10m' }
            );
            
            return {
                success: true,
                requiresMFA: true,
                mfaToken: tempToken,
                userId: user.id
            };
        }

        user.loginAttempts = 0;
        user.lockoutUntil = undefined;
        user.lastLogin = new Date();
        await user.save();

        const accessToken = signAccessToken({ ...user.toObject(), roles: [user.role] } as any);
        const refreshToken = await issueRefreshToken(user._id.toString());

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                organizationId: user.organizationId,
                mfaEnabled: user.twoFactorAuthEnabled,
            },
            accessToken,
            refreshToken,
        };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Internal server error" };
    }
}


export async function verifyEmailCode(code: string, email?: string): Promise<{ success: boolean; error?: string }> {
    try {
        if (!code || code.length !== 6) {
            return { success: false, error: "Invalid verification code" };
        }

        await connectToDB();

        let user;
        
        if (email) {
            // Email-based verification (for new registrations)
            user = await User.findOne({
                email,
                emailVerificationToken: code,
                emailVerificationExpiry: { $gt: new Date() }
            });
        } else {
            // Token-based verification (for logged-in users)
            const cookieStore = await cookies()
            const token = cookieStore.get("auth-token")?.value

            if (!token) {
                return { success: false, error: "Unauthorized" }
            }

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any

            user = await User.findOne({
                _id: decoded.sub,
                emailVerificationToken: code,
                emailVerificationExpiry: { $gt: new Date() }
            });
        }

        if (!user) {
            return { success: false, error: "Invalid or expired verification code" };
        }

        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpiry = undefined;
        await user.save();

        return { success: true };
    } catch (error) {
        console.error("Email verification error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function resendVerificationEmail(): Promise<{ success: boolean; error?: string }> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any

        await connectToDB();

        const user = await User.findById(decoded.sub);
        if (!user) {
            return { success: false, error: "User not found" };
        }

        if (user.emailVerified) {
            return { success: false, error: "Email already verified" };
        }

        // Generate new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.emailVerificationToken = verificationCode;
        user.emailVerificationExpiry = verificationExpires;
        await user.save();

        return { success: true };
    } catch (error) {
        console.error("Resend verification error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function resendVerificationEmailForRegistration(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        await connectToDB();

        const user = await User.findOne({ email, emailVerified: false });
        if (!user) {
            return { success: false, error: "User not found or already verified" };
        }

        // Generate new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.emailVerificationToken = verificationCode;
        user.emailVerificationExpiry = verificationExpires;
        await user.save();

        return { success: true };
    } catch (error) {
        console.error("Resend verification error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function resendVerificationEmailOld(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        await connectToDB();

        const user = await User.findOne({ email, emailVerified: false });
        if (!user) {
            return { success: false, error: "User not found or already verified" };
        }

        // Generate new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.emailVerificationToken = verificationCode;
        user.emailVerificationExpiry = verificationExpires;
        await user.save();

        return { success: true };
    } catch (error) {
        console.error("Resend verification error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function sendMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
    try {
        console.log("[DEBUG] Sending magic link to:", email);
        await connectToDB();

        const user = await User.findOne({ email });
        if (!user) {
            console.log("[DEBUG] User not found for email:", email);
            return { success: false, error: "User not found" };
        }

        console.log("[DEBUG] User found:", user.email);

        // Generate magic link token
        const magicToken = crypto.randomBytes(32).toString('hex');
        const magicTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.resetPasswordToken = magicToken;
        user.resetPasswordExpiry = magicTokenExpires;
        await user.save();

        console.log("[DEBUG] Magic token saved:", magicToken.substring(0, 8) + "...");

        // Create magic link URL
        const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/magic-link?token=${magicToken}`;
        console.log("[DEBUG] Magic link URL:", magicLinkUrl);

        console.log("[DEBUG] Email sent successfully");
        return { success: true };
    } catch (error) {
        console.error("Send magic link error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function verifyMagicLink(token: string): Promise<{ success: boolean; error?: string; accessToken?: string; refreshToken?: string }> {
    try {
        console.log("[DEBUG] Token received:", token, "Length:", token?.length);
        
        if (!token || token.length !== 64) {
            console.log("[DEBUG] Invalid token format");
            return { success: false, error: "Invalid magic link" };
        }

        await connectToDB();
        console.log("[DEBUG] Connected to DB");

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: new Date() }
        });

        console.log("[DEBUG] User found:", !!user);
        
        if (!user) {
            const anyUser = await User.findOne({ resetPasswordToken: token });
            console.log("[DEBUG] Token exists but expired:", !!anyUser);
            if (anyUser) {
                console.log("[DEBUG] Token expires at:", anyUser.resetPasswordExpiry, "Current time:", new Date());
            }
            return { success: false, error: "Invalid or expired magic link" };
        }

        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        user.lastLogin = new Date();
        await user.save();

        // Generate tokens
        const accessToken = signAccessToken({ ...user.toObject(), roles: [user.role] } as any);
        const refreshToken = await issueRefreshToken(user.id);

        return {
            success: true,
            accessToken,
            refreshToken
        };
    } catch (error) {
        console.error("Verify magic link error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function sendPhoneCode(phone: string): Promise<{ success: boolean; error?: string }> {
    try {
        await connectToDB()
        
        const user = await User.findOne({ phone })
        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        user.emailVerificationToken = code
        user.emailVerificationExpiry = expires
        await user.save()

        // Send SMS using smsConfig
       
        await smsConfig({
            text: `Your login code is: ${code}. Valid for 10 minutes.`,
            destinations: [phone]
        })

        return { success: true }
    } catch (error) {
        console.error("Send phone code error:", error)
        return { success: false, error: "Failed to send SMS" }
    }
}

export async function sendPhoneCodeForProfile(): Promise<{ success: boolean; error?: string }> {
    try {
       

        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any
        
        await connectToDB()
        
        const user = await User.findById(decoded.sub)
        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        user.emailVerificationToken = code
        user.emailVerificationExpiry = expires
        await user.save()

        // Send SMS using smsConfig
       
        await smsConfig({
            text: `Your verification code is: ${code}. Valid for 10 minutes.`,
            destinations: [user.phone!]
        })

        return { success: true }
    } catch (error) {
        console.error("Send phone code for profile error:", error)
        return { success: false, error: "Failed to send SMS" }
    }
}

export async function verifyPhoneCode(phone: string, code: string): Promise<{ success: boolean; error?: string; accessToken?: string; refreshToken?: string }> {
    try {
        await connectToDB()

        const user = await User.findOne({
            phone,
            emailVerificationToken: code,
            emailVerificationExpiry: { $gt: new Date() }
        })

        if (!user) {
            return { success: false, error: "Invalid or expired code" }
        }

        user.emailVerificationToken = undefined
        user.emailVerificationExpiry = undefined
        user.lastLogin = new Date()
        await user.save()

        // Generate tokens
        const accessToken = signAccessToken({ ...user.toObject(), roles: [user.role] } as any)
        const refreshToken = await issueRefreshToken(user.id)

        return {
            success: true,
            accessToken,
            refreshToken
        }
    } catch (error) {
        console.error("Verify phone code error:", error)
        return { success: false, error: "Internal server error" }
    }
}

export async function verifyPhoneForProfile(code: string): Promise<{ success: boolean; error?: string }> {
    try {
       

        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any
        
        await connectToDB()
        
        const user = await User.findOne({
            _id: decoded.sub,
            emailVerificationToken: code,
            emailVerificationExpiry: { $gt: new Date() }
        })

        if (!user) {
            return { success: false, error: "Invalid or expired code" }
        }

        user.emailVerified = true
        user.emailVerificationToken = undefined
        user.emailVerificationExpiry = undefined
        await user.save()

        return { success: true }
    } catch (error) {
        console.error("Verify phone for profile error:", error)
        return { success: false, error: "Internal server error" }
    }
}

export async function getCurrentUser(): Promise<{ success: boolean; error?: string; user?: any }> {
    try {
       

        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any
        
        await connectToDB()
        const user = await User.findById(decoded.sub)
        if (!user) return { success: false, error: "User not found" }
        
        return {
            success: true,
            user: JSON.parse(JSON.stringify(user))
        }
    } catch (error) {
        console.error("Get current user error:", error)
        return { success: false, error: "Internal server error" }
    }
}

export async function updateUserProfile(profileData: { fullName?: string; email?: string; phone?: string; imgUrl?: string }): Promise<{ success: boolean; error?: string }> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any
        
        await connectToDB()
        
        if (profileData.email || profileData.phone) {
            const existing = await User.findOne({
                $or: [
                    ...(profileData.email ? [{ email: profileData.email }] : []),
                    ...(profileData.phone ? [{ phone: profileData.phone }] : [])
                ],
                _id: { $ne: decoded.sub }
            })
            
            if (existing) {
                return { success: false, error: "Email or phone already in use" }
            }
        }

        const updateData: any = {}
        if (profileData.fullName) updateData.fullName = profileData.fullName
        if (profileData.email) updateData.email = profileData.email
        if (profileData.phone) updateData.phone = profileData.phone
        if (profileData.imgUrl) updateData.imgUrl = profileData.imgUrl

        const user = await User.findByIdAndUpdate(
            decoded.sub,
            updateData,
            { new: true }
        )

        if (!user) {
            return { success: false, error: "User not found" }
        }

        return { success: true }
    } catch (error) {
        console.error("Update profile error:", error)
        return { success: false, error: "Internal server error" }
    }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
       

        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        if (!token) {
            return { success: false, error: "Unauthorized" }
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any
        
        await connectToDB()
        
        const user = await User.findById(decoded.sub)
        if (!user || !user.password) {
            return { success: false, error: "User not found" }
        }

        // Verify current password
        const isValid = await compare(currentPassword, user.password)
        if (!isValid) {
            return { success: false, error: "Current password is incorrect" }
        }

        // Hash new password
        const newPasswordHash = await hash(newPassword, 12)
        
        await User.findByIdAndUpdate(decoded.sub, {
            password: newPasswordHash
        })

        return { success: true }
    } catch (error) {
        console.error("Change password error:", error)
        return { success: false, error: "Internal server error" }
    }
}

export async function verifyMFACode(code: string, backupCode?: string, mfaToken?: string, rememberDevice?: boolean): Promise<{ success: boolean; error?: string; accessToken?: string; refreshToken?: string; trustedDeviceToken?: string }> {
    try {
        let userId: string;
        
        if (mfaToken) {
            // Use the MFA token from login
            const decoded = jwt.verify(mfaToken, process.env.JWT_ACCESS_SECRET!) as any;
            if (decoded.type !== 'mfa') {
                return { success: false, error: "Invalid MFA token" };
            }
            userId = decoded.userId;
        } else {
            // Fallback to cookie-based auth for existing flows
            const cookieStore = await cookies();
            const token = cookieStore.get("auth-token")?.value;
            
            if (!token) {
                return { success: false, error: "Unauthorized" };
            }
            
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
            userId = decoded.sub;
        }
        
        await connectToDB();
        
        const user = await User.findById(userId);
        if (!user || !user.twoFactorAuthEnabled) {
            return { success: false, error: "MFA not enabled" };
        }

        let isValid = false;

        if (backupCode) {
            // Backup codes not implemented in current model
            return { success: false, error: "Backup codes not supported" };
        } else {
            if (user.twoFactorSecret) {
                isValid = speakeasy.totp.verify({
                    secret: user.twoFactorSecret,
                    encoding: "base32",
                    token: code,
                    window: 2,
                });
            }
        }

        if (!isValid) {
            return { success: false, error: "Invalid verification code" };
        }

        user.loginAttempts = 0;
        user.lockoutUntil = undefined;
        user.lastLogin = new Date();
        
        await user.save();

        const accessToken = signAccessToken({ ...user.toObject(), roles: [user.role] } as any);
        const refreshToken = await issueRefreshToken(user.id);

        return {
            success: true,
            accessToken,
            refreshToken
        };
    } catch (error) {
        console.error("Verify MFA code error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function checkTrustedDevice(userId: string, deviceToken: string): Promise<{ success: boolean; error?: string }> {
    try {
        await connectToDB();
        
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, error: "User not found" };
        }

        // trustedDevices not implemented in User model
        return { success: false };
    } catch (error) {
        console.error("Check trusted device error:", error);
        return { success: false, error: "Internal server error" };
    }
}

export async function fetchUserById(id: string) {
    try {
        await connectToDB()
        const user = await User.findById(id)
        if (!user) return { success: false, error: "User not found" };
        return {
            success: true,
            user: JSON.parse(JSON.stringify(user))
        };

    } catch (error) {
        console.error("fetch user error:", error);
        return { success: false, error: "Internal server error" };
    }
}




export type { User as UserType } from "../helpers/auth"

async function _fetchOrganizationUsers(user: UserType) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const users = await User.find({ organizationId }).populate("employment.departmentId", "name").sort({ createdAt: -1 })

    return { success: true, users: JSON.parse(JSON.stringify(users)) }
  } catch (error) {
    console.error("Fetch users error:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}

export const fetchOrganizationUsers = await withAuth(_fetchOrganizationUsers)

async function _getUsers(user: UserType) {
  try {
    if (!user) throw new Error("User not authenticated")

    await connectToDB()

    const users = await User.find({ 
      organizationId: user.organizationId,
      isActive: true 
    }).select("fullName email _id").sort({ fullName: 1 }).lean()

    return { success: true, data: JSON.parse(JSON.stringify(users)) }
  } catch (error) {
    console.error("Get users error:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}

export const getUsers = await withAuth(_getUsers)

async function _createUser(
  user: UserType,
  data: {
    fullName: string
    email: string
    phone?: string
    password: string
    role: string
    departmentId: string
    isActive: boolean
  }
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const existing = await User.findOne({ email: data.email })
    if (existing) {
      return { success: false, error: "User with this email already exists" }
    }

    const passwordHash = await hash(data.password, 12)
    const employeeID = `EMP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const newUser = await User.create({
      organizationId: new mongoose.Types.ObjectId(organizationId),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: passwordHash,
      role: data.role,
      employment: {
        employeeID,
        dateOfJoining: new Date(),
        departmentId: new mongoose.Types.ObjectId(data.departmentId),
      },
      isActive: data.isActive,
      emailVerified: false,
    })

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "create",
      resource: "user",
      resourceId: newUser._id.toString(),
      details: { after: { fullName: data.fullName, email: data.email, role: data.role } },
    })

    return { success: true, user: JSON.parse(JSON.stringify(newUser)) }
  } catch (error) {
    console.error("Create user error:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export const createUser = await withAuth(_createUser)

async function _updateUser(
  user: UserType,
  staffId: string,
  data: {
    fullName?: string
    email?: string
    phone?: string
    role?: string
    departmentId?: string
    isActive?: boolean
  }
) {
  try {
    await checkWriteAccess(String(user.organizationId));
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const before = await User.findOne({ _id: staffId, organizationId })

    if (!before) {
      return { success: false, error: "User not found" }
    }

    const updateData: any = {}
    if (data.fullName) updateData.fullName = data.fullName
    if (data.email) updateData.email = data.email
    if (data.phone) updateData.phone = data.phone
    if (data.role) updateData.role = data.role
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.departmentId) updateData["employment.departmentId"] = new mongoose.Types.ObjectId(data.departmentId)

    const updatedUser = await User.findOneAndUpdate({ _id: staffId, organizationId }, updateData, { new: true })

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "update",
      resource: "user",
      resourceId: staffId,
      details: {
        before: JSON.parse(JSON.stringify(before)),
        after: data,
      },
    })

    return { success: true, user: JSON.parse(JSON.stringify(updatedUser)) }
  } catch (error) {
    console.error("Update user error:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export const updateUser = await withAuth(_updateUser)

async function _deleteUser(user: UserType, staffId: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const staffUser = await User.findOne({ _id: staffId, organizationId })

    if (!staffUser) {
      return { success: false, error: "User not found" }
    }

    await User.findOneAndDelete({ _id: staffId, organizationId })

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "delete",
      resource: "user",
      resourceId: staffId,
      details: { before: JSON.parse(JSON.stringify(staffUser)) },
    })

    return { success: true }
  } catch (error) {
    console.error("Delete user error:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

export const deleteUser = await withAuth(_deleteUser)

async function _fetchUserByIdAction(user: UserType, staffId: string) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const staffUser = await User.findOne({ _id: staffId, organizationId }).populate("employment.departmentId", "name")

    if (!staffUser) {
      return { success: false, error: "User not found" }
    }

    return { success: true, user: JSON.parse(JSON.stringify(staffUser)) }
  } catch (error) {
    console.error("Fetch user error:", error)
    return { success: false, error: "Failed to fetch user" }
  }
}

export const fetchUserByIdAction = await withAuth(_fetchUserByIdAction)

async function _fetchDepartments(user: UserType) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const departments = await Department.find({ organizationId }).sort({ name: 1 })

    return { success: true, departments: JSON.parse(JSON.stringify(departments)) }
  } catch (error) {
    console.error("Fetch departments error:", error)
    return { success: false, error: "Failed to fetch departments" }
  }
}

export const fetchDepartments = await withAuth(_fetchDepartments)


async function _toggleUserStatus(user: UserType, staffId: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const staffUser = await User.findOne({ _id: staffId, organizationId })

    if (!staffUser) {
      return { success: false, error: "User not found" }
    }

    const newStatus = !staffUser.isActive

    await User.findOneAndUpdate({ _id: staffId, organizationId }, { isActive: newStatus })

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "update",
      resource: "user",
      resourceId: staffId,
      details: {
        before: { isActive: staffUser.isActive },
        after: { isActive: newStatus },
        metadata: { action: newStatus ? "activated" : "deactivated" },
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Toggle user status error:", error)
    return { success: false, error: "Failed to update user status" }
  }
}

export const toggleUserStatus = await withAuth(_toggleUserStatus)

async function _resendInvitation(user: UserType, staffId: string) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const staffUser = await User.findOne({ _id: staffId, organizationId })

    if (!staffUser) {
      return { success: false, error: "User not found" }
    }

    if (staffUser.emailVerified) {
      return { success: false, error: "User email is already verified" }
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    staffUser.emailVerificationToken = verificationCode
    staffUser.emailVerificationExpiry = verificationExpires
    await staffUser.save()

    // TODO: Send invitation email with verification code

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "send",
      resource: "user",
      resourceId: staffId,
      details: { metadata: { action: "resend_invitation", email: staffUser.email } },
    })

    return { success: true }
  } catch (error) {
    console.error("Resend invitation error:", error)
    return { success: false, error: "Failed to resend invitation" }
  }
}

export const resendInvitation = await withAuth(_resendInvitation)

async function _resetUserPassword(user: UserType, staffId: string) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const staffUser = await User.findOne({ _id: staffId, organizationId })

    if (!staffUser) {
      return { success: false, error: "User not found" }
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    staffUser.resetPasswordToken = resetToken
    staffUser.resetPasswordExpiry = resetExpires
    await staffUser.save()

    // TODO: Send password reset email

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "send",
      resource: "user",
      resourceId: staffId,
      details: { metadata: { action: "password_reset_request", email: staffUser.email } },
    })

    return { success: true }
  } catch (error) {
    console.error("Reset password error:", error)
    return { success: false, error: "Failed to reset password" }
  }
}

export const resetUserPassword = await withAuth(_resetUserPassword)


async function _changeUserRole(user: UserType, staffId: string, newRole: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const staffUser = await User.findOne({ _id: staffId, organizationId })

    if (!staffUser) {
      return { success: false, error: "User not found" }
    }

    const oldRole = staffUser.role

    await User.findOneAndUpdate({ _id: staffId, organizationId }, { role: newRole })

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "update",
      resource: "user",
      resourceId: staffId,
      details: {
        before: { role: oldRole },
        after: { role: newRole },
        metadata: { action: "role_change" },
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Change user role error:", error)
    return { success: false, error: "Failed to change user role" }
  }
}

export const changeUserRole = await withAuth(_changeUserRole)

async function _toggle2FA(user: UserType, staffId: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const staffUser = await User.findOne({ _id: staffId, organizationId })

    if (!staffUser) {
      return { success: false, error: "User not found" }
    }

    const newStatus = !staffUser.twoFactorAuthEnabled

    await User.findOneAndUpdate({ _id: staffId, organizationId }, { twoFactorAuthEnabled: newStatus })

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "update",
      resource: "user",
      resourceId: staffId,
      details: {
        before: { twoFactorAuthEnabled: staffUser.twoFactorAuthEnabled },
        after: { twoFactorAuthEnabled: newStatus },
        metadata: { action: "2fa_toggle" },
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Toggle 2FA error:", error)
    return { success: false, error: "Failed to toggle 2FA" }
  }
}

export const toggle2FA = await withAuth(_toggle2FA)

async function _revokeUserSessions(user: UserType, staffId: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const staffUser = await User.findOne({ _id: staffId, organizationId })

    if (!staffUser) {
      return { success: false, error: "User not found" }
    }

    // Update lockoutUntil to force re-login
    await User.findOneAndUpdate(
      { _id: staffId, organizationId },
      { lockoutUntil: new Date(Date.now() + 1000) } // 1 second lockout to force session refresh
    )

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "update",
      resource: "user",
      resourceId: staffId,
      details: { metadata: { action: "revoke_sessions", email: staffUser.email } },
    })

    return { success: true }
  } catch (error) {
    console.error("Revoke sessions error:", error)
    return { success: false, error: "Failed to revoke sessions" }
  }
}

export const revokeUserSessions = await withAuth(_revokeUserSessions)

async function _exportUserData(user: UserType, staffId: string) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const staffUser = await User.findOne({ _id: staffId, organizationId })
      .populate("employment.departmentId", "name")
      .select("-password -resetPasswordToken -emailVerificationToken -twoFactorSecret")

    if (!staffUser) {
      return { success: false, error: "User not found" }
    }

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "export",
      resource: "user",
      resourceId: staffId,
      details: { metadata: { action: "export_user_data", email: staffUser.email } },
    })

    return { success: true, data: JSON.parse(JSON.stringify(staffUser)) }
  } catch (error) {
    console.error("Export user data error:", error)
    return { success: false, error: "Failed to export user data" }
  }
}

export const exportUserData = await withAuth(_exportUserData)
