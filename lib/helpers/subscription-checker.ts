"use server"

import { connectToDB } from "../connection/mongoose"
import Organization from "../models/organization.model"

export async function checkSubscriptionStatus(organizationId: string) {
  try {
    await connectToDB()
    const organization = await Organization.findById(organizationId)
    if (!organization) return null

    const now = new Date()
    const { subscriptionPlan } = organization

    // Skip if trial or already cancelled
    if (subscriptionPlan.status === "trial" || subscriptionPlan.status === "cancelled") {
      return {
        status: subscriptionPlan.status,
        isAccessible: subscriptionPlan.status === "trial",
        isReadOnly: false,
        message: null,
      }
    }

    // Active subscription
    if (subscriptionPlan.expiryDate && now < new Date(subscriptionPlan.expiryDate)) {
      if (subscriptionPlan.status !== "active") {
        await Organization.findByIdAndUpdate(organizationId, {
          "subscriptionPlan.status": "active",
        })
      }
      return {
        status: "active",
        isAccessible: true,
        isReadOnly: false,
        message: null,
        daysUntilExpiry: Math.ceil((new Date(subscriptionPlan.expiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      }
    }

    // Grace period (7 days after expiry)
    if (subscriptionPlan.gracePeriodEnd && now < new Date(subscriptionPlan.gracePeriodEnd)) {
      if (subscriptionPlan.status !== "grace_period") {
        await Organization.findByIdAndUpdate(organizationId, {
          "subscriptionPlan.status": "grace_period",
        })
      }
      const daysLeft = Math.ceil((new Date(subscriptionPlan.gracePeriodEnd).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return {
        status: "grace_period",
        isAccessible: true,
        isReadOnly: false,
        message: `Your subscription has expired. You have ${daysLeft} day${daysLeft > 1 ? 's' : ''} left to renew before your account is suspended.`,
        daysLeft,
      }
    }

    // Suspended (read-only after grace period)
    if (subscriptionPlan.status !== "suspended" && subscriptionPlan.status !== "expired") {
      await Organization.findByIdAndUpdate(organizationId, {
        "subscriptionPlan.status": "suspended",
      })
    }

    return {
      status: "suspended",
      isAccessible: true,
      isReadOnly: true,
      message: "Your subscription has been suspended. Please renew to regain full access.",
    }
  } catch (error) {
    console.error("Error checking subscription status:", error)
    return null
  }
}

export async function getSubscriptionWarning(organizationId: string) {
  const status = await checkSubscriptionStatus(organizationId)
  console.log('status:', status)

  if (!status) return null
  
  // Warning 7 days before expiry
  if (status.status === "trial" && status.daysUntilExpiry && status.daysUntilExpiry <= 7) {
    return {
      type: "warning",
      message: `Your subscription expires in ${status.daysUntilExpiry} day${status.daysUntilExpiry > 1 ? 's' : ''}. Renew now to avoid interruption.`,
      daysLeft: status.daysUntilExpiry,
    }
  }

  // Grace period warning
  if (status.status === "grace_period") {
    return {
      type: "error",
      message: status.message,
      daysLeft: status.daysLeft,
    }
  }

  // Suspended warning
  if (status.status === "suspended") {
    return {
      type: "critical",
      message: status.message,
    }
  }

  return null
}
