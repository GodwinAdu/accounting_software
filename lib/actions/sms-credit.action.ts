"use server";

import { withAuth } from "../helpers/auth";
import { connectToDB } from "../connection/mongoose";
import { revalidatePath } from "next/cache";

async function _getSMSCredits(user: any) {
  try {
    await connectToDB();
    const SMSCredit = (await import("../models/sms-credit.model")).default;

    let credits = await SMSCredit.findOne({
      userId: user._id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!credits) {
      credits = await SMSCredit.create({
        userId: user._id,
        organizationId: user.organizationId,
        balance: 100,
        totalEarned: 100,
        totalSpent: 0,
      });

      const SMSUsage = (await import("../models/sms-usage.model")).default;
      await SMSUsage.create({
        userId: user._id,
        organizationId: user.organizationId,
        type: "bonus",
        amount: 100,
        balance: 100,
        description: "Welcome bonus - 100 free SMS credits",
      });
    }

    return {
      success: true,
      data: {
        balance: credits.balance,
        totalEarned: credits.totalEarned,
        totalSpent: credits.totalSpent,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _deductSMSCredits(user: any, amount: number, description: string, campaignId?: string, recipientCount?: number) {
  try {
    await connectToDB();
    const SMSCredit = (await import("../models/sms-credit.model")).default;

    const credits = await SMSCredit.findOne({
      userId: user._id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (!credits || credits.balance < amount) {
      return { success: false, error: "Insufficient SMS credits" };
    }

    credits.balance -= amount;
    credits.totalSpent += amount;
    await credits.save();

    const SMSUsage = (await import("../models/sms-usage.model")).default;
    await SMSUsage.create({
      userId: user._id,
      organizationId: user.organizationId,
      type: "send",
      amount: -amount,
      balance: credits.balance,
      description,
      campaignId,
      recipientCount,
    });

    return { success: true, balance: credits.balance };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _purchaseSMSCredits(user: any, credits: number, amount: number, paymentMethod: string, pathname: string) {
  try {
    await connectToDB();
    const SMSCreditPurchase = (await import("../models/sms-credit-purchase.model")).default;

    const purchase = await SMSCreditPurchase.create({
      userId: user._id,
      organizationId: user.organizationId,
      credits,
      amount,
      paymentMethod,
      status: "completed",
      transactionId: `TXN-${Date.now()}`,
    });

    const SMSCredit = (await import("../models/sms-credit.model")).default;
    const userCredits = await SMSCredit.findOne({
      userId: user._id,
      organizationId: user.organizationId,
      del_flag: false,
    });

    if (userCredits) {
      userCredits.balance += credits;
      userCredits.totalEarned += credits;
      await userCredits.save();
    }

    const SMSUsage = (await import("../models/sms-usage.model")).default;
    await SMSUsage.create({
      userId: user._id,
      organizationId: user.organizationId,
      type: "purchase",
      amount: credits,
      balance: userCredits?.balance || credits,
      description: `Purchased ${credits} SMS credits for GHS ${amount}`,
    });

    revalidatePath(pathname);
    return { success: true, data: purchase };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
 async function _getSMSUsageHistory(user: any, page: number = 1, limit: number = 20) {
  try {
    await connectToDB();
    const SMSUsage = (await import("../models/sms-usage.model")).default;

    const skip = (page - 1) * limit;
    const [usage, total] = await Promise.all([
      SMSUsage.find({
        userId: user._id,
        organizationId: user.organizationId,
        del_flag: false,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SMSUsage.countDocuments({
        userId: user._id,
        organizationId: user.organizationId,
        del_flag: false,
      }),
    ]);

    return {
      success: true,
      data: usage.map((u) => ({
        id: String(u._id),
        type: u.type,
        amount: u.amount,
        balance: u.balance,
        description: u.description,
        recipientCount: u.recipientCount,
        createdAt: u.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _getPurchaseHistory(user: any, page: number = 1, limit: number = 20) {
  try {
    await connectToDB();
    const SMSCreditPurchase = (await import("../models/sms-credit-purchase.model")).default;

    const skip = (page - 1) * limit;
    const [purchases, total] = await Promise.all([
      SMSCreditPurchase.find({
        userId: user._id,
        organizationId: user.organizationId,
        del_flag: false,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      SMSCreditPurchase.countDocuments({
        userId: user._id,
        organizationId: user.organizationId,
        del_flag: false,
      }),
    ]);

    return {
      success: true,
      data: purchases.map((p) => ({
        id: String(p._id),
        credits: p.credits,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        paymentMethod: p.paymentMethod,
        transactionId: p.transactionId,
        createdAt: p.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const getSMSCredits = await withAuth(_getSMSCredits);
export const deductSMSCredits = await withAuth(_deductSMSCredits);
export const purchaseSMSCredits = await withAuth(_purchaseSMSCredits);
export const getSMSUsageHistory = await withAuth(_getSMSUsageHistory);
export const getPurchaseHistory = await withAuth(_getPurchaseHistory);
