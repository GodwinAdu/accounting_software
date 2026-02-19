import mongoose, { Schema, Document } from "mongoose";

export interface IAsset extends Document {
  organizationId: mongoose.Types.ObjectId;
  assetNumber: string;
  name: string;
  categoryId: mongoose.Types.ObjectId;
  description?: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: "straight_line" | "declining_balance" | "units_of_production";
  usefulLife: number;
  salvageValue: number;
  accumulatedDepreciation: number;
  location?: string;
  serialNumber?: string;
  status: "active" | "disposed" | "under_maintenance" | "retired";
  disposalDate?: Date;
  disposalValue?: number;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const AssetSchema = new Schema<IAsset>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    assetNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "AssetCategory", required: true },
    description: { type: String },
    purchaseDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true },
    currentValue: { type: Number, required: true },
    depreciationMethod: { type: String, enum: ["straight_line", "declining_balance", "units_of_production"], default: "straight_line" },
    usefulLife: { type: Number, required: true },
    salvageValue: { type: Number, default: 0 },
    accumulatedDepreciation: { type: Number, default: 0 },
    location: { type: String },
    serialNumber: { type: String },
    status: { type: String, enum: ["active", "disposed", "under_maintenance", "retired"], default: "active" },
    disposalDate: { type: Date },
    disposalValue: { type: Number },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AssetSchema.index({ organizationId: 1, del_flag: 1 });
AssetSchema.index({ organizationId: 1, status: 1 });
AssetSchema.index({ organizationId: 1, categoryId: 1 });

export default mongoose.models.Asset || mongoose.model<IAsset>("Asset", AssetSchema);
