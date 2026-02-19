import { Schema, model, models } from "mongoose";

const bankRuleSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    name: { type: String, required: true },
    condition: { type: String, enum: ["contains", "starts-with", "ends-with", "equals", "amount-greater", "amount-less"], required: true },
    value: { type: String, required: true },
    category: String,
    action: { type: String, enum: ["categorize", "tag", "flag"], default: "categorize" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    matchCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const BankRule = models.BankRule || model("BankRule", bankRuleSchema);
export default BankRule;
