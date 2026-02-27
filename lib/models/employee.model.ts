import mongoose, { Schema, Document, Model } from "mongoose";
import { encryptApiKey, decryptApiKey } from "../encryption";

export interface IEmployee extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  employeeNumber: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  address?: {
    street?: string;
    city?: string;
    region?: string;
    country?: string;
  };
  department: string;
  position: string;
  employmentType: "full-time" | "part-time" | "contract" | "intern";
  hireDate: Date;
  terminationDate?: Date;
  salary: number;
  paymentFrequency: "monthly" | "bi-weekly" | "weekly";
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
  taxInfo?: {
    tinNumber?: string;
    ssnitNumber?: string;
  };
  status: "active" | "inactive" | "terminated";
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: number;
}

const EmployeeSchema: Schema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    employeeNumber: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    address: {
      street: String,
      city: String,
      region: String,
      country: { type: String, default: "Ghana" },
    },
    department: { type: String, required: true },
    position: { type: String, required: true },
    employmentType: { type: String, enum: ["full-time", "part-time", "contract", "intern"], default: "full-time" },
    hireDate: { type: Date, required: true },
    terminationDate: { type: Date },
    salary: { type: Number, required: true },
    paymentFrequency: { type: String, enum: ["monthly", "bi-weekly", "weekly"], default: "monthly" },
    bankDetails: {
      bankName: String,
      accountNumber: String,
      accountName: String,
    },
    taxInfo: {
      tinNumber: String,
      ssnitNumber: String,
    },
    status: { type: String, enum: ["active", "inactive", "terminated"], default: "active" },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Number, default: 0 },
  },
  { timestamps: true }
);

EmployeeSchema.index({ organizationId: 1, employeeNumber: 1 }, { unique: true });
EmployeeSchema.index({ organizationId: 1, del_flag: 1, status: 1 });
EmployeeSchema.index({ userId: 1 }, { unique: true });

// Encrypt sensitive employee data before saving
EmployeeSchema.pre<IEmployee>('save', function() {
  // Encrypt bank account number
  if (this.bankDetails?.accountNumber && !this.bankDetails.accountNumber.includes(':')) {
    this.bankDetails.accountNumber = encryptApiKey(this.bankDetails.accountNumber)
  }

  // Encrypt TIN number
  if (this.taxInfo?.tinNumber && !this.taxInfo.tinNumber.includes(':')) {
    this.taxInfo.tinNumber = encryptApiKey(this.taxInfo.tinNumber)
  }

  // Encrypt SSNIT number
  if (this.taxInfo?.ssnitNumber && !this.taxInfo.ssnitNumber.includes(':')) {
    this.taxInfo.ssnitNumber = encryptApiKey(this.taxInfo.ssnitNumber)
  }
})

const Employee: Model<IEmployee> = mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema);

export default Employee;
