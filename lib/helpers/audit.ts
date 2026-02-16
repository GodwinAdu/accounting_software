"use server"

import AuditLog from "../models/audit-log.model"
import { connectToDB } from "../connection/mongoose"
import mongoose from "mongoose"

interface LogAuditParams {
  organizationId: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  details?: {
    before?: any
    after?: any
    changes?: string[]
    metadata?: any
  }
  ipAddress?: string
  userAgent?: string
  status?: "success" | "failure"
  errorMessage?: string
}

export async function logAudit(params: LogAuditParams) {
  try {
    await connectToDB()

    await AuditLog.create({
      organizationId: new mongoose.Types.ObjectId(params.organizationId),
      userId: new mongoose.Types.ObjectId(params.userId),
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      details: params.details || {},
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      status: params.status || "success",
      errorMessage: params.errorMessage,
    })
  } catch (error) {
    console.error("Failed to log audit:", error)
  }
}
