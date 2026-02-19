import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWarehouse extends Document {
  organizationId: mongoose.Types.ObjectId;
  warehouseCode: string;
  name: string;
  location: string;
  address: {
    street?: string;
    city?: string;
    region?: string;
    country?: string;
  };
  capacity: number;
  managerId?: mongoose.Types.ObjectId;
  status: "active" | "inactive";
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const WarehouseSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    warehouseCode: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    address: {
      street: String,
      city: String,
      region: String,
      country: { type: String, default: "Ghana" },
    },
    capacity: { type: Number, required: true, default: 10000 },
    managerId: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

WarehouseSchema.index({ organizationId: 1, warehouseCode: 1 }, { unique: true });
WarehouseSchema.index({ organizationId: 1, del_flag: 1, status: 1 });

const Warehouse: Model<IWarehouse> = mongoose.models.Warehouse || mongoose.model<IWarehouse>("Warehouse", WarehouseSchema);

export default Warehouse;
