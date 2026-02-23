import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  company?: string;
  mobile?: string;
  website?: string;
  address?: {
    attention?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  shippingAddress?: {
    attention?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  taxId?: string;
  currency?: string;
  paymentTerms?: string;
  creditLimit?: number;
  openingBalance?: number;
  notes?: string;
  tags?: string;
  status: "active" | "inactive";
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String },
    mobile: { type: String },
    website: { type: String },
    address: {
      attention: String,
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    shippingAddress: {
      attention: String,
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    taxId: { type: String },
    currency: { type: String, default: "GHS" },
    paymentTerms: { type: String, default: "net-30" },
    creditLimit: { type: Number, default: 0 },
    openingBalance: { type: Number, default: 0 },
    notes: { type: String },
    tags: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CustomerSchema.index({ organizationId: 1, del_flag: 1 });
CustomerSchema.index({ organizationId: 1, email: 1 });

export default mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
