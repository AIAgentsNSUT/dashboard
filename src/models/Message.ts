import mongoose, { Schema } from "mongoose";

export interface IMessage {
  text: string;
  userId: string;
  timestamp: Date;
  tags: string[];
}

const MessageSchema = new Schema<IMessage>({
  text: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  tags: [{ type: String, required: true }],
});

const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
