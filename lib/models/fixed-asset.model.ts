import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFixedAsset extends Document {
  organizationId: mongoose.Types.ObjectId;
  assetNumber: string;
  assetName: string;
  description?: string;
  category: "building" | "equipment" | "vehicle" | "furniture" | "computer" | "land" | "other";
  purchaseDate: Date;
  purchasePrice: number;
  salvageValue: number;
  usefulLife: number;
  depreciationMethod: "straight_line" | "declining_balance" | "units_of_production";
  assetAccountId: mongoose.Types.ObjectId;
  depreciationAccountId: mongoose.Types.ObjectId;
  accumulatedDepreciationAccountId: mongoose.Types.ObjectId;
  currentValue: number;
  accumulatedDepreciation: number;
  status: "active" | "disposed" | "fully_depreciated";
  location?: string;
  serialNumber?: string;
  vendor?: string;
  warrantyExpiry?: Date;
  disposalDate?: Date;
  disposalAmount?: number;
  notes?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const FixedAssetSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    assetNumber: { type: String, required: true },
    assetName: { type: String, required: true },
    description: { type: String },
    category: { 
      type: String, 
      enum: ["building", "equipment", "vehicle", "furniture", "computer", "land", "other"],
      required: true 
    },
    purchaseDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true },
    salvageValue: { type: Number, default: 0 },
    usefulLife: { type: Number, required: true },
    depreciationMethod: { 
      type: String, 
      enum: ["straight_line", "declining_balance", "units_of_production"],
      default: "straight_line" 
    },
    assetAccountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    depreciationAccountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    accumulatedDepreciationAccountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    currentValue: { type: Number, required: true },
    accumulatedDepreciation: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ["active", "disposed", "fully_depreciated"],
      default: "active" 
    },
    location: { type: String },
    serialNumber: { type: String },
    vendor: { type: String },
    warrantyExpiry: { type: Date },
    disposalDate: { type: Date },
    disposalAmount: { type: Number },
    notes: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

FixedAssetSchema.index({ organizationId: 1, assetNumber: 1 }, { unique: true });
FixedAssetSchema.index({ organizationId: 1, status: 1, del_flag: 1 });

const FixedAsset: Model<IFixedAsset> = mongoose.models.FixedAsset || mongoose.model<IFixedAsset>("FixedAsset", FixedAssetSchema);

export default FixedAsset;
