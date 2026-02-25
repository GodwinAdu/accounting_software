import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEmployeeLoan extends Document {
  organizationId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  amount: number;
  reason: string;
  repaymentMonths: number;
  monthlyDeduction: number;
  status: "pending" | "approved" | "rejected" | "active" | "completed";
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  outstandingBalance: number;
  totalRepaid: number;
  startDate?: Date;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const EmployeeLoanSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    repaymentMonths: { type: Number, required: true },
    monthlyDeduction: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "active", "completed"], default: "pending" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
    outstandingBalance: { type: Number, default: 0 },
    totalRepaid: { type: Number, default: 0 },
    startDate: { type: Date },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

EmployeeLoanSchema.index({ organizationId: 1, del_flag: 1, status: 1 });
EmployeeLoanSchema.index({ organizationId: 1, employeeId: 1, createdAt: -1 });

const EmployeeLoan: Model<IEmployeeLoan> = mongoose.models.EmployeeLoan || mongoose.model<IEmployeeLoan>("EmployeeLoan", EmployeeLoanSchema);

export default EmployeeLoan;
