import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  organizationId: mongoose.Types.ObjectId;
  leadNumber: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  industry?: string;
  source: "website" | "referral" | "cold_call" | "social_media" | "event" | "other";
  status: "new" | "contacted" | "qualified" | "unqualified" | "converted";
  rating: "hot" | "warm" | "cold";
  value?: number;
  notes?: string;
  assignedTo?: mongoose.Types.ObjectId;
  convertedToCustomerId?: mongoose.Types.ObjectId;
  convertedAt?: Date;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const LeadSchema = new Schema<ILead>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    leadNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    title: { type: String },
    industry: { type: String },
    source: { type: String, enum: ["website", "referral", "cold_call", "social_media", "event", "other"], default: "other" },
    status: { type: String, enum: ["new", "contacted", "qualified", "unqualified", "converted"], default: "new" },
    rating: { type: String, enum: ["hot", "warm", "cold"], default: "warm" },
    value: { type: Number },
    notes: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    convertedToCustomerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    convertedAt: { type: Date },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LeadSchema.index({ organizationId: 1, del_flag: 1 });
LeadSchema.index({ organizationId: 1, status: 1 });

export default mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
