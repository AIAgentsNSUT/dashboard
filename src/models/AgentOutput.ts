import { outputTypes } from "@/lib/data";
import mongoose, { Schema } from "mongoose";

export interface IAgentOutput {
  outputType: OutputType;
  output?: any;
  originalOutput?: any;
  fileId?: mongoose.Types.ObjectId;
  originalFileId?: mongoose.Types.ObjectId;
  edited: boolean;
  editorId?: string;
  editedAt?: Date;
  timestamp: Date;
}

export const AgentOutputSchema = new Schema<IAgentOutput>({
  outputType: {
    type: String,
    enum: outputTypes,
    required: true,
  },
  output: { type: Schema.Types.Mixed },
  originalOutput: { type: Schema.Types.Mixed },
  fileId: { type: mongoose.Types.ObjectId, ref: "FileAttachment" },
  originalFileId: { type: mongoose.Types.ObjectId, ref: "FileAttachment" },
  edited: { type: Boolean, required: true, default: false },
  editorId: { type: String },
  editedAt: { type: Date },
  timestamp: { type: Date, default: Date.now },
});
