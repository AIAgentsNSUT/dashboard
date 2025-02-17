import mongoose, { Document } from "mongoose";

export interface IAIAgent extends Document {
  // for our purposes, we will use the identifier + version to uniquely identify an agent
  identifier: string;
  version: string;

  // the display name and description of the agent
  name: string;
  description: string;

  // the organisation that owns the agent null if global agent
  organisation?: mongoose.Types.ObjectId;

  // inputs and outputs of the agent
  inputs: mongoose.Types.ObjectId[];
  outputs: mongoose.Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const AIAgentSchema = new mongoose.Schema<IAIAgent>(
  {
    identifier: { type: String, required: true },
    version: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    organisation: { type: mongoose.Types.ObjectId, ref: "Organisation" },
    inputs: [{ type: mongoose.Types.ObjectId, ref: "AIAgentData" }],
    outputs: [{ type: mongoose.Types.ObjectId, ref: "AIAgentData" }],
  },
  { timestamps: true }
);

const AIAgent =
  mongoose.models.AIAgent || mongoose.model("AIAgent", AIAgentSchema);

export default AIAgent;
