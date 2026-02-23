import mongoose from "mongoose";

export interface IEquityTransaction extends mongoose.Document {
  organizationId: mongoose.Types.ObjectId;
  transactionNumber: string;
  transactionType: "investment" | "drawing" | "dividend";
  transactionDate: Date;
  amount: number;
  ownerName: string;
  equityAccountId: mongoose.Types.ObjectId;
  cashAccountId: mongoose.Types.ObjectId;
  description?: string;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  del_flag: boolean;
  mod_flag: number;
}

const EquityTransactionSchema = new mongoose.Schema<IEquityTransaction>(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    transactionNumber: { type: String, required: true },
    transactionType: { type: String, enum: ["investment", "drawing", "dividend"], required: true },
    transactionDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    ownerName: { type: String, required: true },
    equityAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    cashAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    description: { type: String },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId },
    deletedBy: { type: mongoose.Schema.Types.ObjectId },
    del_flag: { type: Boolean, default: false },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const EquityTransaction = mongoose.models.EquityTransaction || mongoose.model<IEquityTransaction>("EquityTransaction", EquityTransactionSchema);

export default EquityTransaction;
