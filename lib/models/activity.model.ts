import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  organizationId: mongoose.Types.ObjectId;
  type: "call" | "email" | "meeting" | "task" | "note";
  subject: string;
  description?: string;
  relatedTo: "lead" | "customer" | "opportunity";
  relatedId: mongoose.Types.ObjectId;
  status: "planned" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  completedDate?: Date;
  assignedTo: mongoose.Types.ObjectId;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const ActivitySchema = new Schema<IActivity>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    type: { type: String, enum: ["call", "email", "meeting", "task", "note"], required: true },
    subject: { type: String, required: true },
    description: { type: String },
    relatedTo: { type: String, enum: ["lead", "customer", "opportunity"], required: true },
    relatedId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, enum: ["planned", "completed", "cancelled"], default: "planned" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    dueDate: { type: Date },
    completedDate: { type: Date },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ActivitySchema.index({ organizationId: 1, del_flag: 1 });
ActivitySchema.index({ organizationId: 1, relatedTo: 1, relatedId: 1 });

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);
