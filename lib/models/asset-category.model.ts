import mongoose, { Schema, Document } from "mongoose";

export interface IAssetCategory extends Document {
  organizationId: mongoose.Types.ObjectId;
  categoryCode: string;
  name: string;
  description?: string;
  defaultDepreciationMethod: "straight_line" | "declining_balance" | "units_of_production";
  defaultUsefulLife: number;
  defaultSalvageValue: number;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const AssetCategorySchema = new Schema<IAssetCategory>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    categoryCode: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    defaultDepreciationMethod: { type: String, enum: ["straight_line", "declining_balance", "units_of_production"], default: "straight_line" },
    defaultUsefulLife: { type: Number, required: true },
    defaultSalvageValue: { type: Number, default: 0 },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AssetCategorySchema.index({ organizationId: 1, del_flag: 1 });

export default mongoose.models.AssetCategory || mongoose.model<IAssetCategory>("AssetCategory", AssetCategorySchema);
