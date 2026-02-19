import { Schema, model, models } from "mongoose";

const leadSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    leadNumber: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    title: String,
    source: { type: String, enum: ["website", "referral", "social", "email", "cold-call", "other"], default: "other" },
    status: { type: String, enum: ["new", "contacted", "qualified", "unqualified", "converted"], default: "new" },
    value: { type: Number, default: 0 },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    notes: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Lead = models.Lead || model("Lead", leadSchema);
export default Lead;
