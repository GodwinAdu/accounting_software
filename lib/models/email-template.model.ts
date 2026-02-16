import mongoose, { Schema, Document, Model } from "mongoose"

export interface IEmailTemplate extends Document {
  organizationId: mongoose.Types.ObjectId
  name: string
  type: string
  subject: string
  body: string
  variables: string[]
  isActive: boolean
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const EmailTemplateSchema = new Schema<IEmailTemplate>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["invoice", "receipt", "payment-reminder", "welcome", "password-reset", "payroll", "expense-approval", "custom"],
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    variables: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

EmailTemplateSchema.index({ organizationId: 1, type: 1 })

const EmailTemplate: Model<IEmailTemplate> =
  mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema)

export default EmailTemplate
