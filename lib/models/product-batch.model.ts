import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductBatch extends Document {
  organizationId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  batchNumber: string;
  quantity: number;
  manufactureDate?: Date;
  expiryDate: Date;
  warehouseId?: mongoose.Types.ObjectId;
  status: "active" | "expired" | "recalled";
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const ProductBatchSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    batchNumber: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    manufactureDate: { type: Date },
    expiryDate: { type: Date, required: true, index: true },
    warehouseId: { type: Schema.Types.ObjectId, ref: "Warehouse" },
    status: { type: String, enum: ["active", "expired", "recalled"], default: "active" },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductBatchSchema.index({ organizationId: 1, batchNumber: 1 }, { unique: true });
ProductBatchSchema.index({ organizationId: 1, del_flag: 1, status: 1 });
ProductBatchSchema.index({ organizationId: 1, expiryDate: 1 });

const ProductBatch: Model<IProductBatch> = mongoose.models.ProductBatch || mongoose.model<IProductBatch>("ProductBatch", ProductBatchSchema);

export default ProductBatch;
