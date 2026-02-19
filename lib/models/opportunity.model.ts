import { Schema, model, models } from "mongoose";

const opportunitySchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    opportunityNumber: { type: String, required: true },
    name: { type: String, required: true },
    contactId: { type: Schema.Types.ObjectId, ref: "Contact" },
    value: { type: Number, required: true },
    stage: { type: String, enum: ["prospecting", "qualification", "proposal", "negotiation", "closed-won", "closed-lost"], default: "prospecting" },
    probability: { type: Number, min: 0, max: 100, default: 0 },
    expectedCloseDate: Date,
    actualCloseDate: Date,
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

const Opportunity = models.Opportunity || model("Opportunity", opportunitySchema);
export default Opportunity;
