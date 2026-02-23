import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayrollRun extends Document {
  organizationId: mongoose.Types.ObjectId;
  runNumber: string;
  payPeriod: string;
  payDate: Date;
  startDate: Date;
  endDate: Date;
  employeePayments: Array<{
    employeeId: mongoose.Types.ObjectId;
    grossPay: number;
    deductions: Array<{
      deductionId: mongoose.Types.ObjectId;
      amount: number;
    }>;
    totalDeductions: number;
    netPay: number;
  }>;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  employeeCount: number;
  status: "draft" | "processing" | "completed" | "cancelled";
  processedBy?: mongoose.Types.ObjectId;
  processedAt?: Date;
  notes?: string;
  salaryExpenseAccountId?: mongoose.Types.ObjectId;
  salaryPayableAccountId?: mongoose.Types.ObjectId;
  taxPayableAccountId?: mongoose.Types.ObjectId;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const PayrollRunSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    runNumber: { type: String, required: true },
    payPeriod: { type: String, required: true },
    payDate: { type: Date, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    employeePayments: [
      {
        employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
        grossPay: { type: Number, required: true },
        deductions: [
          {
            deductionId: { type: Schema.Types.ObjectId, ref: "Deduction" },
            amount: { type: Number, required: true },
          },
        ],
        totalDeductions: { type: Number, required: true },
        netPay: { type: Number, required: true },
      },
    ],
    totalGrossPay: { type: Number, required: true },
    totalDeductions: { type: Number, required: true },
    totalNetPay: { type: Number, required: true },
    employeeCount: { type: Number, required: true },
    status: { type: String, enum: ["draft", "processing", "completed", "cancelled"], default: "draft" },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
    processedAt: { type: Date },
    notes: { type: String },
    salaryExpenseAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    salaryPayableAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    taxPayableAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PayrollRunSchema.index({ organizationId: 1, runNumber: 1 }, { unique: true });
PayrollRunSchema.index({ organizationId: 1, del_flag: 1, status: 1 });
PayrollRunSchema.index({ organizationId: 1, payDate: -1 });

const PayrollRun: Model<IPayrollRun> = mongoose.models.PayrollRun || mongoose.model<IPayrollRun>("PayrollRun", PayrollRunSchema);

export default PayrollRun;
