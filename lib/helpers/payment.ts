"use server"

import { connectToDB } from "../connection/mongoose"
import Integration from "../models/integration.model"
import Organization from "../models/organization.model"
import { stripeService } from "@/services/stripe-config"
import { paystackService } from "@/services/paystack-config"
import { flutterwaveService } from "@/services/flutterwave-config"
import { currentUser } from "./session"
import mongoose from "mongoose"

export async function getConnectedPaymentGateways() {
  const user = await currentUser()
  if (!user) return []

  await connectToDB()
  const integrations = await Integration.find({
    organizationId: new mongoose.Types.ObjectId(user.organizationId as string),
    category: "payment",
    status: "connected",
  }).lean()

  return integrations
}

export async function getPreferredPaymentGateway() {
  const user = await currentUser()
  if (!user) return null

  await connectToDB()
  const org = await Organization.findById(user.organizationId).lean()
  const preferredProvider = (org?.paymentSettings as any)?.preferredPaymentGateway

  if (preferredProvider) {
    const integration = await Integration.findOne({
      organizationId: new mongoose.Types.ObjectId(user.organizationId as string),
      provider: preferredProvider,
      status: "connected",
    }).lean()
    if (integration) return integration
  }

  return await Integration.findOne({
    organizationId: new mongoose.Types.ObjectId(user.organizationId as string),
    category: "payment",
    status: "connected",
  }).lean()
}

export async function processPayment(data: {
  amount: number
  currency: string
  email: string
  reference?: string
  metadata?: any
  provider?: string
}) {
  const { provider, ...paymentData } = data
  
  // Handle manual payment
  if (provider === "manual") {
    return {
      status: "success",
      reference: `manual_${Date.now()}`,
      amount: data.amount,
      metadata: data.metadata,
    }
  }
  
  let gateway

  if (provider) {
    const user = await currentUser()
    await connectToDB()
    gateway = await Integration.findOne({
      organizationId: new mongoose.Types.ObjectId(user?.organizationId as string),
      provider,
      status: "connected",
    }).lean()
  } else {
    gateway = await getPreferredPaymentGateway()
  }

  if (!gateway) throw new Error("No payment gateway connected")

  const { amount, currency, email, reference, metadata } = paymentData

  switch (gateway.provider) {
    case "stripe":
      return await stripeService.createPaymentIntent(gateway.credentials.apiSecret!, {
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        metadata,
      })

    case "paystack":
      return await paystackService.initializeTransaction(gateway.credentials.apiSecret!, {
        email,
        amount: Math.round(amount * 100),
        reference,
        metadata,
      })

    case "flutterwave":
      return await flutterwaveService.initiatePayment(gateway.credentials.apiSecret!, {
        tx_ref: reference || `ref_${Date.now()}`,
        amount,
        currency: currency.toUpperCase(),
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
        customer: { email },
        customizations: metadata,
      })

    default:
      throw new Error("Unsupported payment gateway")
  }
}

export async function verifyPayment(reference: string, provider?: string) {
  let gateway

  if (provider) {
    const user = await currentUser()
    await connectToDB()
    gateway = await Integration.findOne({
      organizationId: new mongoose.Types.ObjectId(user?.organizationId as string),
      provider,
      status: "connected",
    }).lean()
  } else {
    gateway = await getPreferredPaymentGateway()
  }

  if (!gateway) throw new Error("No payment gateway connected")

  switch (gateway.provider) {
    case "stripe":
      return await stripeService.retrievePaymentIntent(gateway.credentials.apiSecret!, reference)

    case "paystack":
      return await paystackService.verifyTransaction(gateway.credentials.apiSecret!, reference)

    case "flutterwave":
      return await flutterwaveService.verifyTransaction(gateway.credentials.apiSecret!, reference)

    default:
      throw new Error("Unsupported payment gateway")
  }
}
