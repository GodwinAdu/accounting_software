import mongoose, { Schema, Document, Model } from "mongoose"

export interface IAuditLog extends Document {
  organizationId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  action: string
  resource: string
  resourceId?: string
  details: {
    before?: any
    after?: any
    changes?: string[]
    metadata?: any
  }
  ipAddress?: string
  userAgent?: string
  status: "success" | "failure"
  errorMessage?: string
  createdAt: Date
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    resource: {
      type: String,
      required: true,
      index: true,
    },
    resourceId: {
      type: String,
    },
    details: {
      before: Schema.Types.Mixed,
      after: Schema.Types.Mixed,
      changes: [String],
      metadata: Schema.Types.Mixed,
    },
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: ["success", "failure"],
      default: "success",
    },
    errorMessage: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

AuditLogSchema.index({ organizationId: 1, createdAt: -1 })
AuditLogSchema.index({ userId: 1, createdAt: -1 })
AuditLogSchema.index({ resource: 1, action: 1 })

const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema)

export default AuditLog
