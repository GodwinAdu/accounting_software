import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJournalEntry extends Document {
  organizationId: mongoose.Types.ObjectId;
  entryNumber: string;
  entryDate: Date;
  entryType: "manual" | "automated" | "adjustment" | "closing" | "opening" | "reversal";
  referenceType?: "invoice" | "bill" | "payment" | "expense" | "payroll" | "other";
  referenceId?: mongoose.Types.ObjectId;
  referenceNumber?: string;
  description: string;
  lineItems: Array<{
    accountId: mongoose.Types.ObjectId;
    description?: string;
    debit: number;
    credit: number;
    taxAmount?: number;
    taxAccountId?: mongoose.Types.ObjectId;
  }>;
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  status: "draft" | "posted" | "voided" | "reversed";
  postedDate?: Date;
  postedBy?: mongoose.Types.ObjectId;
  voidedDate?: Date;
  voidedBy?: mongoose.Types.ObjectId;
  voidReason?: string;
  reversalEntryId?: mongoose.Types.ObjectId;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }>;
  tags?: string[];
  notes?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const JournalEntrySchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    entryNumber: { type: String, required: true },
    entryDate: { type: Date, required: true, index: true },
    entryType: { 
      type: String, 
      enum: ["manual", "automated", "adjustment", "closing", "opening", "reversal"], 
      required: true 
    },
    referenceType: { 
      type: String, 
      enum: ["invoice", "bill", "payment", "expense", "payroll", "other"] 
    },
    referenceId: { type: Schema.Types.ObjectId },
    referenceNumber: { type: String },
    description: { type: String, required: true },
    lineItems: [
      {
        accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
        description: String,
        debit: { type: Number, default: 0 },
        credit: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        taxAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
      },
    ],
    totalDebit: { type: Number, required: true },
    totalCredit: { type: Number, required: true },
    isBalanced: { type: Boolean, default: false },
    status: { 
      type: String, 
      enum: ["draft", "posted", "voided", "reversed"], 
      default: "draft",
      index: true 
    },
    postedDate: { type: Date },
    postedBy: { type: Schema.Types.ObjectId, ref: "User" },
    voidedDate: { type: Date },
    voidedBy: { type: Schema.Types.ObjectId, ref: "User" },
    voidReason: { type: String },
    reversalEntryId: { type: Schema.Types.ObjectId, ref: "JournalEntry" },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
        fileSize: Number,
      },
    ],
    tags: [String],
    notes: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

JournalEntrySchema.index({ organizationId: 1, entryNumber: 1 }, { unique: true });
JournalEntrySchema.index({ organizationId: 1, del_flag: 1, status: 1 });
JournalEntrySchema.index({ organizationId: 1, entryDate: -1 });
JournalEntrySchema.index({ referenceType: 1, referenceId: 1 });
JournalEntrySchema.index({ "lineItems.accountId": 1 });

// Pre-save validation for double-entry
JournalEntrySchema.pre("save", function (next) {
  this.isBalanced = Math.abs(this.totalDebit - this.totalCredit) < 0.01;
  if (!this.isBalanced && this.status === "posted") {
    return next(new Error("Journal entry must be balanced before posting"));
  }
  next();
});

const JournalEntry: Model<IJournalEntry> = mongoose.models.JournalEntry || mongoose.model<IJournalEntry>("JournalEntry", JournalEntrySchema);

export default JournalEntry;
