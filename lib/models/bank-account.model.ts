import mongoose, { Schema, Document } from "mongoose";
import { encryptApiKey, decryptApiKey } from "../encryption";

export interface IBankAccount extends Document {
  organizationId: mongoose.Types.ObjectId;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankBranch?: string;
  accountType: "checking" | "savings" | "credit-card" | "money-market" | "other";
  currency: string;
  currentBalance: number;
  openingBalance: number;
  openingBalanceDate: Date;
  accountId?: mongoose.Types.ObjectId; // Link to Chart of Accounts
  routingNumber?: string;
  swiftCode?: string;
  iban?: string;
  isActive: boolean;
  isPrimary: boolean;
  lastReconciledDate?: Date;
  lastReconciledBalance?: number;
  notes?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  deletedAt?: Date;
  deletionReason?: string;
  deletionMetadata?: {
    ipAddress?: string;
    userAgent?: string;
    snapshot?: any;
  };
  mod_flag: number;
}

const BankAccountSchema = new Schema<IBankAccount>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    bankName: { type: String, required: true },
    bankBranch: { type: String },
    accountType: {
      type: String,
      enum: ["checking", "savings", "credit-card", "money-market", "other"],
      required: true,
    },
    currency: { type: String, default: "GHS" },
    currentBalance: { type: Number, default: 0 },
    openingBalance: { type: Number, required: true },
    openingBalanceDate: { type: Date, required: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account" },
    routingNumber: { type: String },
    swiftCode: { type: String },
    iban: { type: String },
    isActive: { type: Boolean, default: true },
    isPrimary: { type: Boolean, default: false },
    lastReconciledDate: { type: Date },
    lastReconciledBalance: { type: Number },
    notes: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date },
    deletionReason: { type: String },
    deletionMetadata: {
      ipAddress: { type: String },
      userAgent: { type: String },
      snapshot: { type: Schema.Types.Mixed },
    },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BankAccountSchema.index({ organizationId: 1, del_flag: 1 });
BankAccountSchema.index({ organizationId: 1, accountNumber: 1 });

// Encrypt sensitive bank data before saving
BankAccountSchema.pre('save', function() {
  // Encrypt account number
  if (this.accountNumber && !this.accountNumber.includes(':')) {
    this.accountNumber = encryptApiKey(this.accountNumber)
  }

  // Encrypt routing number
  if (this.routingNumber && !this.routingNumber.includes(':')) {
    this.routingNumber = encryptApiKey(this.routingNumber)
  }

  // Encrypt IBAN
  if (this.iban && !this.iban.includes(':')) {
    this.iban = encryptApiKey(this.iban)
  }
})

const BankAccount = mongoose.models.BankAccount || mongoose.model<IBankAccount>("BankAccount", BankAccountSchema);

export default BankAccount;
