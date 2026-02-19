import mongoose, { Schema, Document } from "mongoose";

export interface IAIInsight extends Document {
  organizationId: mongoose.Types.ObjectId;
  insightNumber: string;
  type: "cash_flow" | "expense_anomaly" | "revenue_trend" | "tax_optimization" | "fraud_alert" | "budget_alert";
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  category: string;
  impact: number;
  recommendation: string;
  status: "new" | "viewed" | "actioned" | "dismissed";
  metadata: any;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const AIInsightSchema = new Schema<IAIInsight>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    insightNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["cash_flow", "expense_anomaly", "revenue_trend", "tax_optimization", "fraud_alert", "budget_alert"], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    category: { type: String, required: true },
    impact: { type: Number, default: 0 },
    recommendation: { type: String, required: true },
    status: { type: String, enum: ["new", "viewed", "actioned", "dismissed"], default: "new" },
    metadata: { type: Schema.Types.Mixed },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AIInsightSchema.index({ organizationId: 1, del_flag: 1 });
AIInsightSchema.index({ organizationId: 1, status: 1 });
AIInsightSchema.index({ organizationId: 1, type: 1 });

export default mongoose.models.AIInsight || mongoose.model<IAIInsight>("AIInsight", AIInsightSchema);
