import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  organizationId: mongoose.Types.ObjectId;
  budgetNumber: string;
  name: string;
  fiscalYear: number;
  startDate: Date;
  endDate: Date;
  status: "draft" | "active" | "closed";
  departmentId?: mongoose.Types.ObjectId;
  lineItems: Array<{
    accountId: mongoose.Types.ObjectId;
    accountCode: string;
    accountName: string;
    budgetedAmount: number;
    allocations: Array<{
      month: number;
      amount: number;
    }>;
  }>;
  totalBudget: number;
  notes?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const BudgetSchema = new Schema<IBudget>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    budgetNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    fiscalYear: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["draft", "active", "closed"], default: "draft" },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
    lineItems: [
      {
        accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
        accountCode: { type: String, required: true },
        accountName: { type: String, required: true },
        budgetedAmount: { type: Number, required: true },
        allocations: [
          {
            month: { type: Number, required: true, min: 1, max: 12 },
            amount: { type: Number, required: true },
          },
        ],
      },
    ],
    totalBudget: { type: Number, required: true },
    notes: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

BudgetSchema.index({ organizationId: 1, fiscalYear: 1, del_flag: 1 });
BudgetSchema.index({ organizationId: 1, status: 1 });

export default mongoose.models.Budget || mongoose.model<IBudget>("Budget", BudgetSchema);
