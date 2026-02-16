"use server"

import { withAuth, type User } from "../helpers/auth"
import AuditLog from "../models/audit-log.model"
import { connectToDB } from "../connection/mongoose"

async function _fetchAuditLogs(
  user: User,
  filters?: {
    action?: string
    resource?: string
    userId?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }
) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const query: any = { organizationId }

    if (filters?.action) query.action = filters.action
    if (filters?.resource) query.resource = filters.resource
    if (filters?.userId) query.userId = filters.userId
    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {}
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate)
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate)
    }

    const page = filters?.page || 1
    const limit = filters?.limit || 50
    const skip = (page - 1) * limit

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate("userId", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AuditLog.countDocuments(query),
    ])

    return {
      success: true,
      logs: JSON.parse(JSON.stringify(logs)),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("Fetch audit logs error:", error)
    return { success: false, error: "Failed to fetch audit logs" }
  }
}

export const fetchAuditLogs = await withAuth(_fetchAuditLogs)

async function _fetchAuditLogStats(user: User) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const [actionStats, resourceStats, recentActivity] = await Promise.all([
      AuditLog.aggregate([
        { $match: { organizationId } },
        { $group: { _id: "$action", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AuditLog.aggregate([
        { $match: { organizationId } },
        { $group: { _id: "$resource", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AuditLog.countDocuments({
        organizationId,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    ])

    return {
      success: true,
      stats: {
        actionStats: JSON.parse(JSON.stringify(actionStats)),
        resourceStats: JSON.parse(JSON.stringify(resourceStats)),
        recentActivity,
      },
    }
  } catch (error) {
    console.error("Fetch audit log stats error:", error)
    return { success: false, error: "Failed to fetch stats" }
  }
}

export const fetchAuditLogStats = await withAuth(_fetchAuditLogStats)

async function _exportAuditLogs(
  user: User,
  filters?: {
    action?: string
    resource?: string
    startDate?: string
    endDate?: string
  }
) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const query: any = { organizationId }

    if (filters?.action) query.action = filters.action
    if (filters?.resource) query.resource = filters.resource
    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {}
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate)
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate)
    }

    const logs = await AuditLog.find(query)
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 })
      .limit(10000)

    return { success: true, logs: JSON.parse(JSON.stringify(logs)) }
  } catch (error) {
    console.error("Export audit logs error:", error)
    return { success: false, error: "Failed to export logs" }
  }
}

export const exportAuditLogs = await withAuth(_exportAuditLogs)

async function _deleteAuditLog(user: User, logId: string) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    await AuditLog.findOneAndDelete({ _id: logId, organizationId })

    return { success: true }
  } catch (error) {
    console.error("Delete audit log error:", error)
    return { success: false, error: "Failed to delete audit log" }
  }
}

export const deleteAuditLog = await withAuth(_deleteAuditLog)

async function _clearAllAuditLogs(user: User) {
  try {
    if (!user) throw new Error("User not authenticated")

    const organizationId = user.organizationId as string

    if (!organizationId) {
      throw new Error("User does not belong to any organization")
    }

    await connectToDB()

    const result = await AuditLog.deleteMany({ organizationId })

    return { success: true, deletedCount: result.deletedCount }
  } catch (error) {
    console.error("Clear audit logs error:", error)
    return { success: false, error: "Failed to clear audit logs" }
  }
}

export const clearAllAuditLogs = await withAuth(_clearAllAuditLogs)
