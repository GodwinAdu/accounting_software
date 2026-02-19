import mongoose, { Schema, Document } from "mongoose";

export interface IVATFiling extends Document {
  organizationId: mongoose.Types.ObjectId;
  filingNumber: string;
  filingPeriod: string; // e.g., "2024-01" for January 2024
  filingMonth: string; // e.g., "January 2024"
  vatAmount: number;
  filedDate: Date;
  status: "filed" | "paid" | "overdue";
  graReferenceNumber?: string;
  journalEntryId?: mongoose.Types.ObjectId;
  notes?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const VATFilingSchema = new Schema<IVATFiling>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    filingNumber: { type: String, required: true, unique: true },
    filingPeriod: { type: String, required: true },
    filingMonth: { type: String, required: true },
    vatAmount: { type: Number, required: true },
    filedDate: { type: Date, required: true },
    status: { type: String, enum: ["filed", "paid", "overdue"], default: "filed" },
    graReferenceNumber: { type: String },
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

VATFilingSchema.index({ organizationId: 1, filingPeriod: 1 });
VATFilingSchema.index({ organizationId: 1, del_flag: 1 });

const VATFiling = mongoose.models.VATFiling || mongoose.model<IVATFiling>("VATFiling", VATFilingSchema);

export default VATFiling;
