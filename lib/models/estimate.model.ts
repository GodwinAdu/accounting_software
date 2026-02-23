import mongoose, { Schema, Document } from "mongoose";

export interface IEstimate extends Document {
  organizationId: mongoose.Types.ObjectId;
  estimateNumber: string;
  customerId: mongoose.Types.ObjectId;
  estimateDate: Date;
  expiryDate: Date;
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    productId?: mongoose.Types.ObjectId;
  }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  status: "draft" | "sent" | "accepted" | "declined" | "expired";
  revenueAccountId?: mongoose.Types.ObjectId;
  notes?: string;
  terms?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const EstimateSchema = new Schema<IEstimate>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    estimateNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    estimateDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    lineItems: [{
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      rate: { type: Number, required: true },
      amount: { type: Number, required: true },
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
    }],
    subtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["draft", "sent", "accepted", "declined", "expired"], default: "draft" },
    revenueAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    notes: { type: String },
    terms: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EstimateSchema.index({ organizationId: 1, del_flag: 1 });
EstimateSchema.index({ organizationId: 1, customerId: 1 });
EstimateSchema.index({ organizationId: 1, status: 1 });

export default mongoose.models.Estimate || mongoose.model<IEstimate>("Estimate", EstimateSchema);
