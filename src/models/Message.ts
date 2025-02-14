import { Schema } from "mongoose";

export interface IMessage {
  text: string;
  userId: string;
  timestamp: Date;
  tags: string[];
}

export const MessageSchema = new Schema<IMessage>({
  text: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  tags: [{ type: String, required: true }],
});
