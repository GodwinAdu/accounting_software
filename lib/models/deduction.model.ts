import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDeduction extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  type: "statutory" | "voluntary" | "loan" | "other";
  calculationType: "percentage" | "fixed";
  rate: number;
  description?: string;
  status: "active" | "inactive";
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const DeductionSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["statutory", "voluntary", "loan", "other"], required: true },
    calculationType: { type: String, enum: ["percentage", "fixed"], required: true },
    rate: { type: Number, required: true },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

DeductionSchema.index({ organizationId: 1, del_flag: 1, status: 1 });

const Deduction: Model<IDeduction> = mongoose.models.Deduction || mongoose.model<IDeduction>("Deduction", DeductionSchema);

export default Deduction;
