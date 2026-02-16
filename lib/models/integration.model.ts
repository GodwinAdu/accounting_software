import mongoose, { Schema, Document, Model } from "mongoose"

export interface IIntegration extends Document {
  organizationId: mongoose.Types.ObjectId
  provider: string
  category: string
  status: "connected" | "disconnected"
  credentials: {
    apiKey?: string
    apiSecret?: string
    webhookUrl?: string
    accessToken?: string
    refreshToken?: string
    [key: string]: any
  }
  metadata: {
    connectedAt?: Date
    lastSyncAt?: Date
    syncStatus?: string
    [key: string]: any
  }
  createdAt: Date
  updatedAt: Date
}

const IntegrationSchema = new Schema<IIntegration>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    provider: {
      type: String,
      required: true,
      enum: [
        "stripe",
        "paypal",
        "flutterwave",
        "mtn-momo",
        "vodafone-cash",
        "airteltigo",
        "gra",
        "ssnit",
        "quickbooks",
        "xero",
        "sendgrid",
        "slack",
        "aws-s3",
        "cloudinary",
      ],
    },
    category: {
      type: String,
      required: true,
      enum: ["payment", "mobile-money", "government", "accounting", "communication", "storage"],
    },
    status: {
      type: String,
      enum: ["connected", "disconnected"],
      default: "disconnected",
    },
    credentials: {
      type: Schema.Types.Mixed,
      default: {},
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

IntegrationSchema.index({ organizationId: 1, provider: 1 }, { unique: true })

const Integration: Model<IIntegration> =
  mongoose.models.Integration || mongoose.model<IIntegration>("Integration", IntegrationSchema)

export default Integration
