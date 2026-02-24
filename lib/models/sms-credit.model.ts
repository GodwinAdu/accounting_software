import mongoose from "mongoose";

const smsCreditSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    balance: { type: Number, default: 100 },
    totalEarned: { type: Number, default: 100 },
    totalSpent: { type: Number, default: 0 },
    del_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SMSCredit = mongoose.models.SMSCredit || mongoose.model("SMSCredit", smsCreditSchema);
export default SMSCredit;
