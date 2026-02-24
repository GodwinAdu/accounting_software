import mongoose from "mongoose";

const smsCreditPurchaseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    credits: { type: Number, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "GHS" },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    paymentMethod: { type: String },
    transactionId: { type: String },
    del_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SMSCreditPurchase = mongoose.models.SMSCreditPurchase || mongoose.model("SMSCreditPurchase", smsCreditPurchaseSchema);
export default SMSCreditPurchase;
