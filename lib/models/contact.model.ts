import { Schema, model, models } from "mongoose";

const contactSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    contactNumber: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    title: String,
    type: { type: String, enum: ["customer", "vendor", "partner", "other"], default: "customer" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    notes: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Contact = models.Contact || model("Contact", contactSchema);
export default Contact;
