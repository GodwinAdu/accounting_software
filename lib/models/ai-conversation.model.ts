import mongoose, { Schema, Document } from "mongoose";

export interface IAIConversation extends Document {
  userId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  title: string;
  messages: {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    followUpQuestions?: string[];
  }[];
  tags: string[];
  isShared: boolean;
  shareToken?: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
  del_flag: boolean;
}

const AIConversationSchema = new Schema<IAIConversation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    title: { type: String, default: "New Conversation" },
    messages: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        followUpQuestions: [{ type: String }],
      },
    ],
    tags: [{ type: String }],
    isShared: { type: Boolean, default: false },
    shareToken: { type: String },
    lastMessageAt: { type: Date, default: Date.now },
    del_flag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AIConversationSchema.index({ userId: 1, organizationId: 1, del_flag: 1 });
AIConversationSchema.index({ lastMessageAt: -1 });

export default mongoose.models.AIConversation || mongoose.model<IAIConversation>("AIConversation", AIConversationSchema);
