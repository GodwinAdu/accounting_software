import mongoose, { Schema, Document } from "mongoose";

export interface IBankTransfer extends Document {
  organizationId: mongoose.Types.ObjectId;
  transferNumber: string;
  fromAccountId: mongoose.Types.ObjectId;
  toAccountId: mongoose.Types.ObjectId;
  amount: number;
  transferDate: Date;
  notes?: string;
  status: "pending" | "completed" | "cancelled";
  fromTransactionId?: mongoose.Types.ObjectId;
  toTransactionId?: mongoose.Types.ObjectId;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const BankTransferSchema = new Schema<IBankTransfer>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    transferNumber: { type: String, required: true, unique: true },
    fromAccountId: { type: Schema.Types.ObjectId, ref: "BankAccount", required: true },
    toAccountId: { type: Schema.Types.ObjectId, ref: "BankAccount", required: true },
    amount: { type: Number, required: true },
    transferDate: { type: Date, required: true },
    notes: { type: String },
    status: { type: String, enum: ["pending", "completed", "cancelled"], default: "completed" },
    fromTransactionId: { type: Schema.Types.ObjectId, ref: "BankTransaction" },
    toTransactionId: { type: Schema.Types.ObjectId, ref: "BankTransaction" },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BankTransferSchema.index({ organizationId: 1, del_flag: 1 });
BankTransferSchema.index({ organizationId: 1, transferDate: 1 });

const BankTransfer = mongoose.models.BankTransfer || mongoose.model<IBankTransfer>("BankTransfer", BankTransferSchema);

export default BankTransfer;
