import mongoose, { Schema, Document } from "mongoose";

export interface IBankTransaction extends Document {
  organizationId: mongoose.Types.ObjectId;
  bankAccountId: mongoose.Types.ObjectId;
  transactionNumber: string;
  transactionDate: Date;
  transactionType: "deposit" | "withdrawal" | "transfer" | "fee" | "interest" | "other";
  amount: number;
  description: string;
  payee?: string;
  referenceNumber?: string;
  checkNumber?: string;
  category?: string;
  isReconciled: boolean;
  reconciledDate?: Date;
  journalEntryId?: mongoose.Types.ObjectId;
  notes?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const BankTransactionSchema = new Schema<IBankTransaction>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    bankAccountId: { type: Schema.Types.ObjectId, ref: "BankAccount", required: true },
    transactionNumber: { type: String, required: true, unique: true },
    transactionDate: { type: Date, required: true },
    transactionType: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer", "fee", "interest", "other"],
      required: true,
    },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    payee: { type: String },
    referenceNumber: { type: String },
    checkNumber: { type: String },
    category: { type: String },
    isReconciled: { type: Boolean, default: false },
    reconciledDate: { type: Date },
    journalEntryId: { type: Schema.Types.ObjectId, ref: "JournalEntry" },
    notes: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BankTransactionSchema.index({ organizationId: 1, bankAccountId: 1, del_flag: 1 });
BankTransactionSchema.index({ organizationId: 1, transactionDate: 1 });
BankTransactionSchema.index({ organizationId: 1, isReconciled: 1 });

const BankTransaction =
  mongoose.models.BankTransaction || mongoose.model<IBankTransaction>("BankTransaction", BankTransactionSchema);

export default BankTransaction;
