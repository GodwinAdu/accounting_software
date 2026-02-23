import mongoose, { Schema, Document } from "mongoose";

export interface IPOItem {
  productId?: mongoose.Types.ObjectId;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface IPurchaseOrder extends Document {
  organizationId: mongoose.Types.ObjectId;
  poNumber: string;
  vendorId: mongoose.Types.ObjectId;
  orderDate: Date;
  expectedDate?: Date;
  items: IPOItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: "draft" | "sent" | "confirmed" | "received" | "cancelled";
  inventoryAccountId?: mongoose.Types.ObjectId;
  payableAccountId?: mongoose.Types.ObjectId;
  notes?: string;
  
  // Audit
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
  del_flag: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    poNumber: { type: String, required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    orderDate: { type: Date, required: true },
    expectedDate: { type: Date },
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      amount: { type: Number, required: true },
    }],
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ["draft", "sent", "confirmed", "received", "cancelled"], default: "draft" },
    inventoryAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    payableAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    notes: { type: String },
    
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

PurchaseOrderSchema.index({ organizationId: 1, poNumber: 1 }, { unique: true });
PurchaseOrderSchema.index({ organizationId: 1, del_flag: 1, orderDate: -1 });
PurchaseOrderSchema.index({ organizationId: 1, status: 1 });
PurchaseOrderSchema.index({ organizationId: 1, vendorId: 1 });

const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model<IPurchaseOrder>("PurchaseOrder", PurchaseOrderSchema);

export default PurchaseOrder;
