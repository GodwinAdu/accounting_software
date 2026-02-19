import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStockTransfer extends Document {
  organizationId: mongoose.Types.ObjectId;
  transferNumber: string;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  fromWarehouseId: mongoose.Types.ObjectId;
  toWarehouseId: mongoose.Types.ObjectId;
  status: "pending" | "approved" | "in-transit" | "completed" | "cancelled";
  requestedBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  completedAt?: Date;
  notes?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const StockTransferSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    transferNumber: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    fromWarehouseId: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true },
    toWarehouseId: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true },
    status: { type: String, enum: ["pending", "approved", "in-transit", "completed", "cancelled"], default: "pending" },
    requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    completedAt: { type: Date },
    notes: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

StockTransferSchema.index({ organizationId: 1, transferNumber: 1 }, { unique: true });
StockTransferSchema.index({ organizationId: 1, del_flag: 1, status: 1 });

const StockTransfer: Model<IStockTransfer> = mongoose.models.StockTransfer || mongoose.model<IStockTransfer>("StockTransfer", StockTransferSchema);

export default StockTransfer;
