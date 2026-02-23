import mongoose, { Schema, Document } from "mongoose";

export interface IBillItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface IBill extends Document {
  organizationId: mongoose.Types.ObjectId;
  billNumber: string;
  vendorId: mongoose.Types.ObjectId;
  billDate: Date;
  dueDate: Date;
  items: IBillItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balance: number;
  status: "draft" | "open" | "paid" | "overdue" | "cancelled";
  expenseAccountId?: mongoose.Types.ObjectId;
  payableAccountId?: mongoose.Types.ObjectId;
  taxAccountId?: mongoose.Types.ObjectId;
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

const BillSchema = new Schema<IBill>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    billNumber: { type: String, required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    billDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    items: [{
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      amount: { type: Number, required: true },
    }],
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    balance: { type: Number, required: true },
    status: { type: String, enum: ["draft", "open", "paid", "overdue", "cancelled"], default: "draft" },
    expenseAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    payableAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    taxAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    notes: { type: String },
    
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

BillSchema.index({ organizationId: 1, billNumber: 1 }, { unique: true });
BillSchema.index({ organizationId: 1, del_flag: 1, billDate: -1 });
BillSchema.index({ organizationId: 1, status: 1 });
BillSchema.index({ organizationId: 1, vendorId: 1 });

const Bill = mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSchema);

export default Bill;
