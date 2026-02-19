import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBudget extends Document {
  organizationId: mongoose.Types.ObjectId;
  budgetNumber: string;
  name: string;
  fiscalYear: number;
  startDate: Date;
  endDate: Date;
  type: "annual" | "department" | "project";
  departmentId?: mongoose.Types.ObjectId;
  categories: Array<{
    categoryName: string;
    accountId?: mongoose.Types.ObjectId;
    budgetedAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
  }>;
  totalBudgeted: number;
  totalActual: number;
  totalVariance: number;
  status: "draft" | "approved" | "active" | "closed";
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  notes?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const BudgetSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    budgetNumber: { type: String, required: true },
    name: { type: String, required: true },
    fiscalYear: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: { type: String, enum: ["annual", "department", "project"], required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
    categories: [
      {
        categoryName: { type: String, required: true },
        accountId: { type: Schema.Types.ObjectId, ref: "Account" },
        budgetedAmount: { type: Number, required: true, default: 0 },
        actualAmount: { type: Number, default: 0 },
        variance: { type: Number, default: 0 },
        variancePercent: { type: Number, default: 0 },
      },
    ],
    totalBudgeted: { type: Number, required: true, default: 0 },
    totalActual: { type: Number, default: 0 },
    totalVariance: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "approved", "active", "closed"], default: "draft" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    notes: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BudgetSchema.index({ organizationId: 1, budgetNumber: 1 }, { unique: true });
BudgetSchema.index({ organizationId: 1, del_flag: 1, status: 1 });
BudgetSchema.index({ organizationId: 1, fiscalYear: 1 });

const Budget: Model<IBudget> = mongoose.models.Budget || mongoose.model<IBudget>("Budget", BudgetSchema);

export default Budget;
