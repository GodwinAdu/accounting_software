import mongoose, { Schema, Document } from "mongoose";

export interface IRecurringInvoice extends Document {
  organizationId: mongoose.Types.ObjectId;
  profileName: string;
  customerId: mongoose.Types.ObjectId;
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
  startDate: Date;
  endDate?: Date;
  nextDate: Date;
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
  status: "active" | "paused" | "completed" | "cancelled";
  notes?: string;
  terms?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const RecurringInvoiceSchema = new Schema<IRecurringInvoice>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    profileName: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    frequency: { type: String, enum: ["daily", "weekly", "monthly", "quarterly", "yearly"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    nextDate: { type: Date, required: true },
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
    status: { type: String, enum: ["active", "paused", "completed", "cancelled"], default: "active" },
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

RecurringInvoiceSchema.index({ organizationId: 1, del_flag: 1 });
RecurringInvoiceSchema.index({ organizationId: 1, customerId: 1 });
RecurringInvoiceSchema.index({ organizationId: 1, status: 1 });

export default mongoose.models.RecurringInvoice || mongoose.model<IRecurringInvoice>("RecurringInvoice", RecurringInvoiceSchema);
