import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  organizationId: mongoose.Types.ObjectId;
  expenseNumber: string;
  vendorId?: mongoose.Types.ObjectId;
  categoryId?: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
  paymentMethod: "cash" | "bank_transfer" | "mobile_money" | "cheque" | "card";
  reference?: string;
  description?: string;
  receiptUrl?: string;
  status: "pending" | "approved" | "paid" | "rejected";
  
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
    paymentMethod: { type: String, enum: ["cash", "bank_transfer", "mobile_money", "cheque", "card"], required: true },
    reference: { type: String },
    description: { type: String },
    receiptUrl: { type: String },
    status: { type: String, enum: ["pending", "approved", "paid", "rejected"], default: "pending" },
    
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
