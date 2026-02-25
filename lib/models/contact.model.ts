import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  organizationId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  jobTitle?: string;
  department?: string;
  isPrimary: boolean;
  notes?: string;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const ContactSchema = new Schema<IContact>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    mobile: { type: String },
    jobTitle: { type: String },
    department: { type: String },
    isPrimary: { type: Boolean, default: false },
    notes: { type: String },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ContactSchema.index({ organizationId: 1, customerId: 1, del_flag: 1 });
ContactSchema.index({ organizationId: 1, email: 1 });

export default mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);
