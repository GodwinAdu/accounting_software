import { Schema, model, models } from "mongoose";

const creditNoteSchema = new Schema(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    creditNoteNumber: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" },
    date: { type: Date, required: true },
    reason: String,
    items: [{
      description: String,
      quantity: Number,
      unitPrice: Number,
      amount: Number,
    }],
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, enum: ["draft", "issued", "applied"], default: "draft" },
    notes: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    modifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
    mod_flag: { type: Boolean, default: false },
    del_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CreditNote = models.CreditNote || model("CreditNote", creditNoteSchema);
export default CreditNote;
