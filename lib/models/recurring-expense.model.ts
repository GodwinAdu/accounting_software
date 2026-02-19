import mongoose, { Schema, Document } from "mongoose";

export interface IRecurringExpense extends Document {
  organizationId: mongoose.Types.ObjectId;
  expenseNumber: string;
  vendorId?: mongoose.Types.ObjectId;
  categoryId?: mongoose.Types.ObjectId;
  description: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  startDate: Date;
  endDate?: Date;
  nextDate: Date;
  paymentMethod: "cash" | "card" | "bank_transfer" | "mobile_money" | "cheque";
  status: "active" | "paused" | "completed" | "cancelled";
  notes?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const RecurringExpenseSchema = new Schema<IRecurringExpense>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    expenseNumber: { type: String, required: true, unique: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor" },
    categoryId: { type: Schema.Types.ObjectId, ref: "ExpenseCategory" },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    frequency: { type: String, enum: ["daily", "weekly", "monthly", "quarterly", "yearly"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    nextDate: { type: Date, required: true },
    paymentMethod: { type: String, enum: ["cash", "card", "bank_transfer", "mobile_money", "cheque"], required: true },
    status: { type: String, enum: ["active", "paused", "completed", "cancelled"], default: "active" },
    notes: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

RecurringExpenseSchema.index({ organizationId: 1, del_flag: 1 });
RecurringExpenseSchema.index({ organizationId: 1, status: 1 });

export default mongoose.models.RecurringExpense || mongoose.model<IRecurringExpense>("RecurringExpense", RecurringExpenseSchema);
