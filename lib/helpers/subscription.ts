import { connectToDB } from "../connection/mongoose"
import Organization from "../models/organization.model"

export async function checkSubscriptionStatus(organizationId: string) {
  try {
    await connectToDB()
    
    const org = await Organization.findById(organizationId)
    
    if (!org) {
      return { valid: false, reason: "Organization not found" }
    }

    const { status, expiryDate } = org.subscriptionPlan

    // Allow trial and active subscriptions
    if (status === "trial" || status === "active") {
      // Check if expired
      if (expiryDate && new Date(expiryDate) < new Date()) {
        await Organization.findByIdAndUpdate(organizationId, {
          "subscriptionPlan.status": "expired"
        })
        return { valid: false, reason: "Subscription expired" }
      }
      return { valid: true }
    }

    return { valid: false, reason: `Subscription ${status}` }
  } catch (error) {
    return { valid: false, reason: "Error checking subscription" }
  }
}
