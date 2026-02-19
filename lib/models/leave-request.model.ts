import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILeaveRequest extends Document {
  organizationId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  leaveType: "annual" | "sick" | "maternity" | "paternity" | "unpaid" | "other";
  startDate: Date;
  endDate: Date;
  days: number;
  reason?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const LeaveRequestSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    leaveType: { type: String, enum: ["annual", "sick", "maternity", "paternity", "unpaid", "other"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true },
    reason: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected", "cancelled"], default: "pending" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

LeaveRequestSchema.index({ organizationId: 1, del_flag: 1, status: 1 });
LeaveRequestSchema.index({ organizationId: 1, employeeId: 1, startDate: -1 });

const LeaveRequest: Model<ILeaveRequest> = mongoose.models.LeaveRequest || mongoose.model<ILeaveRequest>("LeaveRequest", LeaveRequestSchema);

export default LeaveRequest;
