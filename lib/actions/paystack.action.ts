"use server";

import { withAuth } from "../helpers/auth";
import { connectToDB } from "../connection/mongoose";

async function _initializePayment(user: any, credits: number, amount: number) {
  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: amount * 100,
        currency: "GHS",
        metadata: {
          userId: String(user._id),
          organizationId: String(user.organizationId),
          credits,
          type: "sms_credits",
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/callback`,
      }),
    });

    const data = await response.json();

    if (data.status) {
      await connectToDB();
      const SMSCreditPurchase = (await import("../models/sms-credit-purchase.model")).default;

      await SMSCreditPurchase.create({
        userId: user._id,
        organizationId: user.organizationId,
        credits,
        amount,
        status: "pending",
        paymentMethod: "paystack",
        transactionId: data.data.reference,
      });

      return {
        success: true,
        authorizationUrl: data.data.authorization_url,
        reference: data.data.reference,
      };
    }

    return { success: false, error: data.message || "Payment initialization failed" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function _verifyPayment(user: any, reference: string, pathname: string) {
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (data.status && data.data.status === "success") {
      await connectToDB();
      const SMSCreditPurchase = (await import("../models/sms-credit-purchase.model")).default;
      const SMSCredit = (await import("../models/sms-credit.model")).default;
      const SMSUsage = (await import("../models/sms-usage.model")).default;

      const purchase = await SMSCreditPurchase.findOneAndUpdate(
        { transactionId: reference, userId: user._id },
        { status: "completed" },
        { new: true }
      );

      if (purchase) {
        const userCredits = await SMSCredit.findOne({
          userId: user._id,
          organizationId: user.organizationId,
          del_flag: false,
        });

        if (userCredits) {
          userCredits.balance += purchase.credits;
          userCredits.totalEarned += purchase.credits;
          await userCredits.save();
        }

        await SMSUsage.create({
          userId: user._id,
          organizationId: user.organizationId,
          type: "purchase",
          amount: purchase.credits,
          balance: userCredits?.balance || purchase.credits,
          description: `Purchased ${purchase.credits} SMS credits for GHS ${purchase.amount}`,
        });
      }

      return { success: true };
    }

    return { success: false, error: "Payment verification failed" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const initializePayment = await withAuth(_initializePayment);
export const verifyPayment = await withAuth(_verifyPayment);
