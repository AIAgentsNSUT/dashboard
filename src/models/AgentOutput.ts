import { outputTypes } from "@/lib/data";
import mongoose, { Schema } from "mongoose";

export interface IAgentOutput {
  outputType: OutputType;
  output?: any;
  fileId?: mongoose.Types.ObjectId;
  edited: boolean;
  editorId?: string;
  editedAt?: Date;
  timestamp: Date;
}

const AgentOutputSchema = new Schema<IAgentOutput>({
  outputType: {
    type: String,
    enum: outputTypes,
    required: true,
  },
  output: { type: Schema.Types.Mixed },
  fileId: { type: mongoose.Types.ObjectId, ref: "FileAttachment" },
  edited: { type: Boolean, required: true, default: false },
  editorId: { type: String },
  editedAt: { type: Date },
  timestamp: { type: Date, default: Date.now },
});

const AgentOutput =
  mongoose.models.AgentOutputSchema ||
  mongoose.model<IAgentOutput>("AgentOutput", AgentOutputSchema);
export default AgentOutput;
