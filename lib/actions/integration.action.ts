"use server"

import { withAuth, type User } from "../helpers/auth"
import Integration from "../models/integration.model"
import { connectToDB } from "../connection/mongoose"
import { logAudit } from "../helpers/audit"
import { checkWriteAccess } from "../helpers/check-write-access"

async function _fetchIntegrations(user: User) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const integrations = await Integration.find({ organizationId })
    if (!integrations) {
      return { success: true, integrations: [] }
    }

    return { success: true, integrations: JSON.parse(JSON.stringify(integrations)) }
  } catch (error) {
    console.error("Fetch integrations error:", error)
    return { success: false, error: "Failed to fetch integrations" }
  }
}

export const fetchIntegrations = await withAuth(_fetchIntegrations)

async function _connectIntegration(
  user: User,
  data: {
    provider: string
    category: string
    credentials: {
      apiKey?: string
      apiSecret?: string
      webhookUrl?: string
      [key: string]: any
    }
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

    const integration = await Integration.findOneAndUpdate(
      { organizationId, provider: data.provider },
      {
        organizationId,
        provider: data.provider,
        category: data.category,
        status: "connected",
        credentials: data.credentials,
        metadata: {
          connectedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    )

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "create",
      resource: "integration",
      resourceId: integration._id.toString(),
      details: { after: { provider: data.provider, category: data.category } },
    })

    return { success: true, integration: JSON.parse(JSON.stringify(integration)) }
  } catch (error) {
    console.error("Connect integration error:", error)
    return { success: false, error: "Failed to connect integration" }
  }
}

export const connectIntegration = await withAuth(_connectIntegration)

async function _disconnectIntegration(user: User, provider: string) {
  try {
    await checkWriteAccess(String(user.organizationId));
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    await Integration.findOneAndUpdate(
      { organizationId, provider },
      {
        status: "disconnected",
        credentials: {},
        metadata: {},
      }
    )

    await logAudit({
      organizationId,
      userId: String(user._id || user.id),
      action: "delete",
      resource: "integration",
      resourceId: provider,
      details: { metadata: { provider } },
    })

    return { success: true }
  } catch (error) {
    console.error("Disconnect integration error:", error)
    return { success: false, error: "Failed to disconnect integration" }
  }
}

export const disconnectIntegration = await withAuth(_disconnectIntegration)
