import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITimeEntry extends Document {
  organizationId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  totalHours: number;
  overtimeHours: number;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: mongoose.Types.ObjectId;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const TimeEntrySchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, required: true },
    clockIn: { type: Date, required: true },
    clockOut: { type: Date },
    totalHours: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    notes: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TimeEntrySchema.index({ organizationId: 1, del_flag: 1, date: -1 });
TimeEntrySchema.index({ organizationId: 1, employeeId: 1, date: -1 });

const TimeEntry: Model<ITimeEntry> = mongoose.models.TimeEntry || mongoose.model<ITimeEntry>("TimeEntry", TimeEntrySchema);

export default TimeEntry;
