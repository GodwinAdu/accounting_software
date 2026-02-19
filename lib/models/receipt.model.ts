import mongoose, { Schema, Document } from "mongoose";

export interface IReceipt extends Document {
  organizationId: mongoose.Types.ObjectId;
  receiptNumber: string;
  customerId: mongoose.Types.ObjectId;
  paymentId: mongoose.Types.ObjectId;
  receiptDate: Date;
  amount: number;
  paymentMethod: "cash" | "card" | "bank_transfer" | "mobile_money" | "cheque";
  notes?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const ReceiptSchema = new Schema<IReceipt>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    receiptNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    receiptDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "card", "bank_transfer", "mobile_money", "cheque"], required: true },
    notes: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReceiptSchema.index({ organizationId: 1, del_flag: 1 });
ReceiptSchema.index({ organizationId: 1, customerId: 1 });

export default mongoose.models.Receipt || mongoose.model<IReceipt>("Receipt", ReceiptSchema);
