import mongoose, { Schema, Document } from "mongoose";

export interface IInvoice extends Document {
  organizationId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  customerId: mongoose.Types.ObjectId;
  invoiceDate: Date;
  dueDate: Date;
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
  paidAmount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  revenueAccountId?: mongoose.Types.ObjectId;
  receivableAccountId?: mongoose.Types.ObjectId;
  taxAccountId?: mongoose.Types.ObjectId;
  notes?: string;
  terms?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    invoiceNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
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
    paidAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "sent", "paid", "overdue", "cancelled"], default: "draft" },
    revenueAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    receivableAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
    taxAccountId: { type: Schema.Types.ObjectId, ref: "Account" },
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

InvoiceSchema.index({ organizationId: 1, del_flag: 1 });
InvoiceSchema.index({ organizationId: 1, customerId: 1 });
InvoiceSchema.index({ organizationId: 1, status: 1 });

export default mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
