import mongoose, { Schema, Document } from "mongoose";

export interface IVendor extends Document {
  organizationId: mongoose.Types.ObjectId;
  vendorNumber: string;
  companyName: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  website?: string;
  
  // Address
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  
  // Banking
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    branch?: string;
  };
  
  // Tax
  taxInfo?: {
    tinNumber?: string;
    vatNumber?: string;
  };
  
  // Business
  paymentTerms?: string;
  creditLimit?: number;
  currency: string;
  category?: string;
  notes?: string;
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

const VendorSchema = new Schema<IVendor>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    vendorNumber: { type: String, required: true },
    companyName: { type: String, required: true },
    contactPerson: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    website: { type: String },
    
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: "Ghana" },
      postalCode: { type: String },
    },
    
    bankDetails: {
      bankName: { type: String },
      accountNumber: { type: String },
      accountName: { type: String },
      branch: { type: String },
    },
    
    taxInfo: {
      tinNumber: { type: String },
      vatNumber: { type: String },
    },
    
    paymentTerms: { type: String, default: "Net 30" },
    creditLimit: { type: Number, default: 0 },
    currency: { type: String, default: "GHS" },
    category: { type: String },
    notes: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

VendorSchema.index({ organizationId: 1, vendorNumber: 1 }, { unique: true });
VendorSchema.index({ organizationId: 1, email: 1 });
VendorSchema.index({ organizationId: 1, del_flag: 1 });

const Vendor = mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", VendorSchema);

export default Vendor;
