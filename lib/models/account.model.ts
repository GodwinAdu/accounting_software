import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAccount extends Document {
  organizationId: mongoose.Types.ObjectId;
  accountCode: string;
  accountName: string;
  accountType: "asset" | "liability" | "equity" | "revenue" | "expense";
  accountSubType: string;
  parentAccountId?: mongoose.Types.ObjectId;
  level: number;
  isParent: boolean;
  currency: string;
  description?: string;
  taxType?: string;
  currentBalance: number;
  debitBalance: number;
  creditBalance: number;
  isActive: boolean;
  isSystemAccount: boolean;
  allowManualJournal: boolean;
  reconciliationEnabled: boolean;
  lastReconciledDate?: Date;
  metadata?: {
    bankAccountNumber?: string;
    bankName?: string;
    taxRate?: number;
    defaultAccount?: boolean;
  };
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const AccountSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    accountCode: { type: String, required: true },
    accountName: { type: String, required: true },
    accountType: { 
      type: String, 
      enum: ["asset", "liability", "equity", "revenue", "expense"], 
      required: true,
      index: true 
    },
    accountSubType: { type: String, required: true },
    parentAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    level: { type: Number, default: 0 },
    isParent: { type: Boolean, default: false },
    currency: { type: String, default: "GHS" },
    description: { type: String },
    taxType: { type: String },
    currentBalance: { type: Number, default: 0, index: true },
    debitBalance: { type: Number, default: 0 },
    creditBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isSystemAccount: { type: Boolean, default: false },
    allowManualJournal: { type: Boolean, default: true },
    reconciliationEnabled: { type: Boolean, default: false },
    lastReconciledDate: { type: Date },
    metadata: {
      bankAccountNumber: String,
      bankName: String,
      taxRate: Number,
      defaultAccount: Boolean,
    },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

AccountSchema.index({ organizationId: 1, accountCode: 1 }, { unique: true });
AccountSchema.index({ organizationId: 1, del_flag: 1, isActive: 1 });
AccountSchema.index({ organizationId: 1, accountType: 1, del_flag: 1 });
AccountSchema.index({ parentAccountId: 1 });

const Account: Model<IAccount> = mongoose.models.Account || mongoose.model<IAccount>("Account", AccountSchema);

export default Account;
