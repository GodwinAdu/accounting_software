import mongoose, { Schema, Document } from "mongoose";

export interface IBankReconciliation extends Document {
  organizationId: mongoose.Types.ObjectId;
  bankAccountId: mongoose.Types.ObjectId;
  reconciliationNumber: string;
  reconciliationDate: Date;
  statementDate: Date;
  statementBalance: number;
  bookBalance: number;
  difference: number;
  status: "in-progress" | "completed" | "cancelled";
  reconciledTransactions: mongoose.Types.ObjectId[];
  notes?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const BankReconciliationSchema = new Schema<IBankReconciliation>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    bankAccountId: { type: Schema.Types.ObjectId, ref: "BankAccount", required: true },
    reconciliationNumber: { type: String, required: true, unique: true },
    reconciliationDate: { type: Date, required: true },
    statementDate: { type: Date, required: true },
    statementBalance: { type: Number, required: true },
    bookBalance: { type: Number, required: true },
    difference: { type: Number, default: 0 },
    status: { type: String, enum: ["in-progress", "completed", "cancelled"], default: "in-progress" },
    reconciledTransactions: [{ type: Schema.Types.ObjectId, ref: "BankTransaction" }],
    notes: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BankReconciliationSchema.index({ organizationId: 1, bankAccountId: 1, del_flag: 1 });
BankReconciliationSchema.index({ organizationId: 1, status: 1 });

const BankReconciliation =
  mongoose.models.BankReconciliation ||
  mongoose.model<IBankReconciliation>("BankReconciliation", BankReconciliationSchema);

export default BankReconciliation;
