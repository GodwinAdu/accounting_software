import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  organizationId: mongoose.Types.ObjectId;
  expenseNumber: string;
  vendorId?: mongoose.Types.ObjectId;
  categoryId?: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
  taxAmount: number;
  taxRate: number;
  isTaxable: boolean;
  paymentMethod: "cash" | "bank_transfer" | "mobile_money" | "cheque" | "card";
  reference?: string;
  description?: string;
  receiptUrl?: string;
  status: "pending" | "approved" | "paid" | "rejected";
  expenseAccountId?: mongoose.Types.ObjectId;
  paymentAccountId?: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectedBy?: mongoose.Types.ObjectId;
  rejectedAt?: Date;
  rejectionReason?: string;
  
  // Audit
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
  del_flag: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    expenseNumber: { type: String, required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
    categoryId: { type: Schema.Types.ObjectId, ref: "ExpenseCategory" },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    isTaxable: { type: Boolean, default: true },
    paymentMethod: { type: String, enum: ["cash", "bank_transfer", "mobile_money", "cheque", "card"], required: true },
    reference: { type: String },
    description: { type: String },
    receiptUrl: { type: String },
    status: { type: String, enum: ["pending", "approved", "paid", "rejected"], default: "pending" },
    expenseAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    paymentAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectedBy: { type: Schema.Types.ObjectId, ref: "User" },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
    
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

ExpenseSchema.index({ organizationId: 1, expenseNumber: 1 }, { unique: true });
ExpenseSchema.index({ organizationId: 1, del_flag: 1, date: -1 });
ExpenseSchema.index({ organizationId: 1, status: 1 });

const Expense = mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);

export default Expense;
