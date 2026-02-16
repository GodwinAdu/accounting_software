"use server"

import { initializePayment } from "@/lib/paystack"

export async function createPaymentSession(data: {
  email: string
  amount: number
  plan: string
  organizationId: string
}) {
  try {
    const result = await initializePayment(data.email, data.amount, {
      plan: data.plan,
      organizationId: data.organizationId,
    })

    if (!result.success) {
      return { success: false, error: result.error }
    }

    return {
      success: true,
      authorizationUrl: result.data.authorization_url,
      reference: result.data.reference,
    }
  } catch (error) {
    return { success: false, error: "Failed to create payment session" }
  }
}
