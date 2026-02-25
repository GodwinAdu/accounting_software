import mongoose, { Schema, Document } from "mongoose";

export interface IOpportunity extends Document {
  organizationId: mongoose.Types.ObjectId;
  opportunityNumber: string;
  name: string;
  customerId?: mongoose.Types.ObjectId;
  leadId?: mongoose.Types.ObjectId;
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
  amount: number;
  probability: number;
  expectedCloseDate: Date;
  actualCloseDate?: Date;
  source: string;
  description?: string;
  lostReason?: string;
  assignedTo: mongoose.Types.ObjectId;
  del_flag: boolean;
  createdBy: mongoose.Types.ObjectId;
  modifiedBy?: mongoose.Types.ObjectId;
  deletedBy?: mongoose.Types.ObjectId;
  mod_flag: boolean;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    opportunityNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead" },
    stage: { 
      type: String, 
      enum: ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"], 
      default: "prospecting" 
    },
    amount: { type: Number, required: true },
    probability: { type: Number, default: 50, min: 0, max: 100 },
    expectedCloseDate: { type: Date, required: true },
    actualCloseDate: { type: Date },
    source: { type: String },
    description: { type: String },
    lostReason: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    del_flag: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

OpportunitySchema.index({ organizationId: 1, del_flag: 1 });
OpportunitySchema.index({ organizationId: 1, stage: 1 });

export default mongoose.models.Opportunity || mongoose.model<IOpportunity>("Opportunity", OpportunitySchema);
