import mongoose from "mongoose";

export interface ILoan extends mongoose.Document {
  organizationId: mongoose.Types.ObjectId;
  loanNumber: string;
  loanName: string;
  loanType: "term-loan" | "line-of-credit" | "mortgage" | "other";
  lender: string;
  principalAmount: number;
  interestRate: number; // annual percentage
  loanTerm: number; // in months
  startDate: Date;
  maturityDate: Date;
  paymentFrequency: "monthly" | "quarterly" | "annually";
  paymentAmount: number;
  outstandingBalance: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  loanAccountId: mongoose.Types.ObjectId;
  interestAccountId: mongoose.Types.ObjectId;
  status: "active" | "paid-off" | "defaulted";
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  del_flag: boolean;
  mod_flag: number;
}

const LoanSchema = new mongoose.Schema<ILoan>(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    loanNumber: { type: String, required: true },
    loanName: { type: String, required: true },
    loanType: { type: String, enum: ["term-loan", "line-of-credit", "mortgage", "other"], required: true },
    lender: { type: String, required: true },
    principalAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    loanTerm: { type: Number, required: true },
    startDate: { type: Date, required: true },
    maturityDate: { type: Date, required: true },
    paymentFrequency: { type: String, enum: ["monthly", "quarterly", "annually"], default: "monthly" },
    paymentAmount: { type: Number, required: true },
    outstandingBalance: { type: Number, required: true },
    totalInterestPaid: { type: Number, default: 0 },
    totalPrincipalPaid: { type: Number, default: 0 },
    loanAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    interestAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    status: { type: String, enum: ["active", "paid-off", "defaulted"], default: "active" },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId },
    deletedBy: { type: mongoose.Schema.Types.ObjectId },
    del_flag: { type: Boolean, default: false },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Loan = mongoose.models.Loan || mongoose.model<ILoan>("Loan", LoanSchema);

export default Loan;
