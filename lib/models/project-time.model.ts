import mongoose, { Schema, Document } from "mongoose";

export interface IProjectTime extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  hours: number;
  description?: string;
  billable: boolean;
  hourlyRate: number;
  amount: number;
  status: "draft" | "submitted" | "approved" | "rejected";
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const ProjectTimeSchema = new Schema<IProjectTime>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    hours: { type: Number, required: true },
    description: { type: String },
    billable: { type: Boolean, default: true },
    hourlyRate: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["draft", "submitted", "approved", "rejected"], default: "draft" },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProjectTimeSchema.index({ organizationId: 1, del_flag: 1 });
ProjectTimeSchema.index({ organizationId: 1, projectId: 1 });

export default mongoose.models.ProjectTime || mongoose.model<IProjectTime>("ProjectTime", ProjectTimeSchema);
