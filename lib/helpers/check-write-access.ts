"use server"

import { checkSubscriptionStatus } from "./subscription-checker"

export async function checkWriteAccess(organizationId: string) {
  const status = await checkSubscriptionStatus(organizationId)
  
  if (!status) {
    throw new Error("Unable to verify subscription status")
  }

  // Block write operations if suspended
  if (status.isReadOnly) {
    throw new Error("Your subscription has been suspended. Please renew to regain access. Visit Settings > Subscription to renew.")
  }

  // Allow write operations for trial, active, and grace period
  return true
}
