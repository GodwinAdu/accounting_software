import mongoose from "mongoose";

export interface IFixedAsset extends mongoose.Document {
  organizationId: mongoose.Types.ObjectId;
  assetNumber: string;
  assetName: string;
  assetType: "property" | "equipment" | "vehicle" | "furniture" | "other";
  purchaseDate: Date;
  purchasePrice: number;
  salvageValue: number;
  usefulLife: number; // in years
  depreciationMethod: "straight-line" | "declining-balance";
  assetAccountId: mongoose.Types.ObjectId;
  depreciationAccountId: mongoose.Types.ObjectId;
  accumulatedDepreciation: number;
  currentValue: number;
  status: "active" | "disposed" | "fully-depreciated";
  disposalDate?: Date;
  disposalAmount?: number;
  location?: string;
  serialNumber?: string;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  del_flag: boolean;
  mod_flag: number;
}

const FixedAssetSchema = new mongoose.Schema<IFixedAsset>(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    assetNumber: { type: String, required: true },
    assetName: { type: String, required: true },
    assetType: { type: String, enum: ["property", "equipment", "vehicle", "furniture", "other"], required: true },
    purchaseDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true },
    salvageValue: { type: Number, default: 0 },
    usefulLife: { type: Number, required: true },
    depreciationMethod: { type: String, enum: ["straight-line", "declining-balance"], default: "straight-line" },
    assetAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    depreciationAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    accumulatedDepreciation: { type: Number, default: 0 },
    currentValue: { type: Number, required: true },
    status: { type: String, enum: ["active", "disposed", "fully-depreciated"], default: "active" },
    disposalDate: { type: Date },
    disposalAmount: { type: Number },
    location: { type: String },
    serialNumber: { type: String },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId },
    deletedBy: { type: mongoose.Schema.Types.ObjectId },
    del_flag: { type: Boolean, default: false },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const FixedAsset = mongoose.models.FixedAsset || mongoose.model<IFixedAsset>("FixedAsset", FixedAssetSchema);

export default FixedAsset;
