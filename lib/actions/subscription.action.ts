"use server"

import { revalidatePath } from "next/cache"
import { connectToDB } from "../connection/mongoose"
import { withAuth, type User } from "../helpers/auth"
import Organization from "../models/organization.model"
import { logAudit } from "../helpers/audit"

const MODULE_PRICES = {
  sales: 30,
  expenses: 25,
  payroll: 50,
  tax: 35,
  products: 20,
  projects: 25,
  crm: 30,
  budgeting: 40,
  assets: 20,
  ai: 50,
}

const BASE_PRICING = {
  starter: 150,
  professional: 400,
  enterprise: 0,
}

async function _getSubscription(user: User) {
  try {
    await connectToDB()

    const organization = await Organization.findById(user.organizationId)
    if (!organization) throw new Error("Organization not found")

    // Get default modules from schema
    const defaultModules = {
      dashboard: true,
      banking: true,
      sales: false,
      expenses: false,
      payroll: false,
      accounting: true,
      tax: false,
      products: false,
      reports: true,
      settings: true,
      projects: false,
      crm: false,
      budgeting: false,
      assets: false,
      ai: false,
    }

    return {
      modules: organization.modules || defaultModules,
      subscriptionPlan: organization.subscriptionPlan,
    }
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch subscription")
  }
}

async function _calculateSubscriptionAmount(user: User, modules: Record<string, boolean>) {
  try {
    await connectToDB()
    const organization = await Organization.findById(user.organizationId)
    if (!organization) throw new Error("Organization not found")

    let total = BASE_PRICING[organization.subscriptionPlan.plan] || 0
    Object.entries(modules).forEach(([module, enabled]) => {
      if (enabled && MODULE_PRICES[module as keyof typeof MODULE_PRICES]) {
        total += MODULE_PRICES[module as keyof typeof MODULE_PRICES]
      }
    })
    return { amount: total, currency: "GHS", plan: organization.subscriptionPlan.plan }
  } catch (error: any) {
    throw new Error(error.message || "Failed to calculate amount")
  }
}

async function _updateSubscription(
  user: User,
  data: {
    modules?: Record<string, boolean>
    plan?: string
    billingPeriod?: number
    amount: number
    paymentReference: string
  },
  path: string
) {
  try {
    if(!user) throw new Error("User not authorized")
    await connectToDB()

    const oldOrg = await Organization.findById(user.organizationId)
    if (!oldOrg) throw new Error("Organization not found")

    const now = new Date()
    const expiryDate = new Date(now)
    expiryDate.setMonth(expiryDate.getMonth() + (data.billingPeriod || 1))

    const gracePeriodEnd = new Date(expiryDate)
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7)

    const updateData: any = {
      modifiedBy: user._id,
      mod_flag: true,
      "subscriptionPlan.status": "active",
      "subscriptionPlan.expiryDate": expiryDate,
      "subscriptionPlan.gracePeriodEnd": gracePeriodEnd,
      "subscriptionPlan.lastPaymentDate": now,
      "subscriptionPlan.startDate": oldOrg.subscriptionPlan?.startDate || now,
    }

    if (data.modules) {
      updateData.modules = { ...oldOrg.modules, ...data.modules }
    }

    if (data.plan) {
      updateData["subscriptionPlan.plan"] = data.plan
    }

    const organization = await Organization.findByIdAndUpdate(
      user.organizationId,
      updateData,
      { new: true }
    )

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "subscription",
      resourceId: String(user.organizationId),
      details: {
        before: { 
          modules: oldOrg.modules,
          plan: oldOrg.subscriptionPlan?.plan,
          status: oldOrg.subscriptionPlan?.status,
          expiryDate: oldOrg.subscriptionPlan?.expiryDate,
        },
        after: { 
          modules: organization?.modules,
          plan: organization?.subscriptionPlan?.plan,
          status: organization?.subscriptionPlan?.status,
          expiryDate: organization?.subscriptionPlan?.expiryDate,
        },
        paymentReference: data.paymentReference,
        amount: data.amount,
        billingPeriod: data.billingPeriod,
      },
    })

    revalidatePath(path)
    return { success: true, modules: organization?.modules, plan: organization?.subscriptionPlan }
  } catch (error: any) {
    throw new Error(error.message || "Failed to update subscription")
  }
}

async function _updateModules(
  user: User,
  modules: Record<string, boolean>,
  path: string
) {
  try {
    if(!user) throw new Error("User not authorized")
    await connectToDB()

    const oldOrg = await Organization.findById(user.organizationId)
    if (!oldOrg) throw new Error("Organization not found")

    const organization = await Organization.findByIdAndUpdate(
      user.organizationId,
      {
        modules: {
          ...oldOrg.modules,
          ...modules,
        },
        modifiedBy: user._id,
        mod_flag: true,
      },
      { new: true }
    )

    await logAudit({
      organizationId: String(user.organizationId),
      userId: String(user._id || user.id),
      action: "update",
      resource: "subscription_modules",
      resourceId: String(user.organizationId),
      details: {
        before: { modules: oldOrg.modules },
        after: { modules: organization?.modules },
      },
    })

    revalidatePath(path)
    return { success: true, modules: organization?.modules }
  } catch (error: any) {
    throw new Error(error.message || "Failed to update modules")
  }
}

async function _initializePayment(
  user: User, 
  data: {
    amount: number
    modules?: Record<string, boolean>
    plan?: string
    billingPeriod?: number
  }
) {
  try {
    if(!user) throw new Error("User not authorized")
    if (!process.env.PAYSTACK_SECRET_KEY) {
      throw new Error("Paystack secret key not configured")
    }

    if (!data.amount || data.amount <= 0) {
      throw new Error("Invalid payment amount")
    }

    if (!user.email) {
      throw new Error("User email not found")
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: data.amount * 100,
        currency: "GHS",
        metadata: {
          organizationId: user.organizationId,
          userId: user._id || user.id,
          modules: data.modules,
          plan: data.plan,
          billingPeriod: data.billingPeriod,
        },
      }),
    })

    const result = await response.json()
    if (!result.status) throw new Error(result.message || "Payment initialization failed")

    return {
      authorizationUrl: result.data.authorization_url,
      reference: result.data.reference,
    }
  } catch (error: any) {
    console.error("Payment initialization error:", error)
    throw new Error(error.message || "Failed to initialize payment")
  }
}

async function _verifyPayment(user: User, reference: string) {
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    const data = await response.json()
    if (!data.status) throw new Error(data.message || "Payment verification failed")

    return {
      status: data.data.status,
      amount: data.data.amount / 100,
      reference: data.data.reference,
    }
  } catch (error: any) {
    throw new Error(error.message || "Failed to verify payment")
  }
}

export const getSubscription = await withAuth(_getSubscription)
export const calculateSubscriptionAmount = await withAuth(_calculateSubscriptionAmount)
export const updateSubscription = await withAuth(_updateSubscription)
export const updateModules = await withAuth(_updateModules)
export const initializePayment = await withAuth(_initializePayment)
export const verifyPayment = await withAuth(_verifyPayment)
