import mongoose, { Schema, Document } from "mongoose";

export interface IExpenseCategory extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  status: "active" | "inactive";
  
  // Audit
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
  del_flag: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseCategorySchema = new Schema<IExpenseCategory>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

ExpenseCategorySchema.index({ organizationId: 1, name: 1 }, { unique: true });
ExpenseCategorySchema.index({ organizationId: 1, del_flag: 1 });

const ExpenseCategory = mongoose.models.ExpenseCategory || mongoose.model<IExpenseCategory>("ExpenseCategory", ExpenseCategorySchema);

export default ExpenseCategory;
