import { Schema, model, models } from "mongoose";

const portalSettingsSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, unique: true },
    enabled: { type: Boolean, default: true },
    features: {
      viewInvoices: { type: Boolean, default: true },
      makePayments: { type: Boolean, default: true },
      downloadDocuments: { type: Boolean, default: true },
      viewPaymentHistory: { type: Boolean, default: true },
    },
    branding: {
      logo: String,
      primaryColor: String,
      customDomain: String,
    },
    totalVisits: { type: Number, default: 0 },
    activeCustomers: { type: Number, default: 0 },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PortalSettings = models.PortalSettings || model("PortalSettings", portalSettingsSchema);
export default PortalSettings;
