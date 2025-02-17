import mongoose, { Document } from "mongoose";

export type AgentDataType = "File" | "Text" | "JSON";

export interface IAIAgentData extends Document {
  // the type of data that the agent data represents
  type: AgentDataType;

  // for our purposes, we will use the identifier + version to uniquely identify an agent data type
  identifier: string;
  version: string;

  // the display name and description of the agent type
  name: string;
  description: string;

  required: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const AIAgentDataSchema = new mongoose.Schema<IAIAgentData>(
  {
    type: { type: String, enum: ["File", "Text", "JSON"], required: true },
    identifier: { type: String, required: true },
    version: { type: String, required: true },
    name: { type: String, required: true },
    required: { type: Boolean, required: true, default: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const AIAgentData =
  mongoose.models.AIAgentData ||
  mongoose.model("AIAgentData", AIAgentDataSchema);

export default AIAgentData;
