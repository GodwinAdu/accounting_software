import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGeneralLedger extends Document {
  organizationId: mongoose.Types.ObjectId;
  accountId: mongoose.Types.ObjectId;
  journalEntryId: mongoose.Types.ObjectId;
  transactionDate: Date;
  description: string;
  debit: number;
  credit: number;
  runningBalance: number;
  referenceType?: string;
  referenceId?: mongoose.Types.ObjectId;
  referenceNumber?: string;
  fiscalYear: number;
  fiscalPeriod: number;
  isReconciled: boolean;
  reconciledDate?: Date;
  del_flag: boolean;
}

const GeneralLedgerSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true, index: true },
    journalEntryId: { type: Schema.Types.ObjectId, ref: "JournalEntry", required: true },
    transactionDate: { type: Date, required: true, index: true },
    description: { type: String, required: true },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    runningBalance: { type: Number, default: 0 },
    referenceType: { type: String },
    referenceId: { type: Schema.Types.ObjectId },
    referenceNumber: { type: String },
    fiscalYear: { type: Number, required: true, index: true },
    fiscalPeriod: { type: Number, required: true },
    isReconciled: { type: Boolean, default: false },
    reconciledDate: { type: Date },
    del_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

GeneralLedgerSchema.index({ organizationId: 1, accountId: 1, transactionDate: -1 });
GeneralLedgerSchema.index({ organizationId: 1, fiscalYear: 1, fiscalPeriod: 1 });
GeneralLedgerSchema.index({ journalEntryId: 1 });

const GeneralLedger: Model<IGeneralLedger> = mongoose.models.GeneralLedger || mongoose.model<IGeneralLedger>("GeneralLedger", GeneralLedgerSchema);

export default GeneralLedger;
