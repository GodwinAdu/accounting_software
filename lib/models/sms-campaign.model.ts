import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISMSCampaign extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  message: string;
  recipients: {
    type: "all" | "customers" | "employees" | "custom";
    phones?: string[];
    customerIds?: mongoose.Types.ObjectId[];
    employeeIds?: mongoose.Types.ObjectId[];
  };
  status: "draft" | "scheduled" | "sent" | "failed";
  scheduledAt?: Date;
  sentAt?: Date;
  stats: {
    sent: number;
    delivered: number;
    failed: number;
  };
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const SMSCampaignSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true },
    message: { type: String, required: true, maxlength: 160 },
    recipients: {
      type: {
        type: String,
        enum: ["all", "customers", "employees", "custom"],
        required: true,
      },
      phones: [{ type: String }],
      customerIds: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
      employeeIds: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    },
    status: { type: String, enum: ["draft", "scheduled", "sent", "failed"], default: "draft" },
    scheduledAt: { type: Date },
    sentAt: { type: Date },
    stats: {
      sent: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
    },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SMSCampaignSchema.index({ organizationId: 1, del_flag: 1, status: 1 });

const SMSCampaign: Model<ISMSCampaign> = mongoose.models.SMSCampaign || mongoose.model<ISMSCampaign>("SMSCampaign", SMSCampaignSchema);

export default SMSCampaign;
