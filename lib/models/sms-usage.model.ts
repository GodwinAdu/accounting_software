import mongoose from "mongoose";

const smsUsageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    type: { type: String, enum: ["send", "purchase", "bonus"], required: true },
    amount: { type: Number, required: true },
    balance: { type: Number, required: true },
    description: { type: String, required: true },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "SMSCampaign" },
    recipientCount: { type: Number },
    del_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SMSUsage = mongoose.models.SMSUsage || mongoose.model("SMSUsage", smsUsageSchema);
export default SMSUsage;
