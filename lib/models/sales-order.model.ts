import mongoose, { Schema, Document } from "mongoose";

export interface ISalesOrderItem {
  productId: mongoose.Types.ObjectId;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  variantSku?: string;
}

export interface ISalesOrder extends Document {
  organizationId: mongoose.Types.ObjectId;
  orderNumber: string;
  customerId: mongoose.Types.ObjectId;
  orderDate: Date;
  deliveryDate?: Date;
  items: ISalesOrderItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid: number;
  balance: number;
  status: "draft" | "confirmed" | "delivered" | "paid" | "cancelled";
  paymentMethod?: string;
  notes?: string;
  
  // GL Account Overrides (optional - uses product accounts if not set)
  revenueAccountId?: mongoose.Types.ObjectId;
  receivableAccountId?: mongoose.Types.ObjectId;
  taxAccountId?: mongoose.Types.ObjectId;
  
  // Audit
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
  del_flag: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SalesOrderSchema = new Schema<ISalesOrder>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    orderNumber: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    orderDate: { type: Date, required: true },
    deliveryDate: { type: Date },
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      amount: { type: Number, required: true },
      variantSku: { type: String },
    }],
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    balance: { type: Number, required: true },
    status: { type: String, enum: ["draft", "confirmed", "delivered", "paid", "cancelled"], default: "draft" },
    paymentMethod: { type: String },
    notes: { type: String },
    
    revenueAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    receivableAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    taxAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

SalesOrderSchema.index({ organizationId: 1, orderNumber: 1 }, { unique: true });
SalesOrderSchema.index({ organizationId: 1, del_flag: 1, orderDate: -1 });
SalesOrderSchema.index({ organizationId: 1, status: 1 });
SalesOrderSchema.index({ organizationId: 1, customerId: 1 });

const SalesOrder = mongoose.models.SalesOrder || mongoose.model<ISalesOrder>("SalesOrder", SalesOrderSchema);

export default SalesOrder;
