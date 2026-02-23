import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  organizationId: mongoose.Types.ObjectId;
  paymentNumber: string;
  customerId: mongoose.Types.ObjectId;
  invoiceId?: mongoose.Types.ObjectId;
  paymentDate: Date;
  amount: number;
  paymentMethod: "cash" | "card" | "bank_transfer" | "mobile_money" | "cheque" | "manual";
  reference?: string;
  notes?: string;
  status: "completed" | "pending" | "failed" | "refunded";
  bankAccountId?: mongoose.Types.ObjectId;
  receivableAccountId?: mongoose.Types.ObjectId;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const PaymentSchema = new Schema<IPayment>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    paymentNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" },
    paymentDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cash", "card", "bank_transfer", "mobile_money", "cheque", "manual"], required: true },
    reference: { type: String },
    notes: { type: String },
    status: { type: String, enum: ["completed", "pending", "failed", "refunded"], default: "completed" },
    bankAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    receivableAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PaymentSchema.index({ organizationId: 1, del_flag: 1 });
PaymentSchema.index({ organizationId: 1, customerId: 1 });
PaymentSchema.index({ organizationId: 1, invoiceId: 1 });

export default mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
