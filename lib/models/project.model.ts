import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  organizationId: mongoose.Types.ObjectId;
  projectNumber: string;
  name: string;
  description?: string;
  clientId?: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  status: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  budget: number;
  actualCost: number;
  revenue: number;
  managerId: mongoose.Types.ObjectId;
  revenueAccountId?: mongoose.Types.ObjectId;
  expenseAccountId?: mongoose.Types.ObjectId;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const ProjectSchema = new Schema<IProject>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    projectNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    clientId: { type: Schema.Types.ObjectId, ref: "Customer" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, enum: ["planning", "active", "on_hold", "completed", "cancelled"], default: "planning" },
    budget: { type: Number, required: true },
    actualCost: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    managerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    revenueAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    expenseAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProjectSchema.index({ organizationId: 1, del_flag: 1 });
ProjectSchema.index({ organizationId: 1, status: 1 });

export default mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
