import { fileTypes } from "@/lib/data";
import mongoose, { Document, Schema } from "mongoose";

export interface IAIAgent extends Document {
  agentId: string;
  name: string;
  description: string;
  version: number;
  org?: mongoose.Types.ObjectId;
  inputs: {
    agents: {
      agent: mongoose.Types.ObjectId;
      version: string;
      required: boolean;
    }[];
    files: {
      type: FileType;
      label: string;
      description?: string;
      required: boolean;
    }[];
    inputid: string;
  }[];
  outputAgents: {
    agent: mongoose.Types.ObjectId;
    version: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const AIAgentSchema = new Schema<IAIAgent>(
  {
    agentId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    version: { type: Number, required: true },
    org: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      default: null,
    },
    inputs: [
      {
        agents: [
          {
            agent: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "AIAgent",
              required: true,
            },
            version: { type: String, required: true },
            required: { type: Boolean, required: true },
          },
        ],
        files: [
          {
            type: {
              type: String,
              required: true,
              enum: fileTypes,
            },
            label: { type: String, required: true },
            description: { type: String },
            required: { type: Boolean, required: true },
          },
        ],
        inputid: { type: String, required: true },
      },
    ],
    outputAgents: [
      {
        agent: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AIAgent",
          required: true,
        },
        version: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

AIAgentSchema.index({ agentId: 1, version: 1 }, { unique: true });

const AIAgent =
  mongoose.models.AIAgent || mongoose.model<IAIAgent>("AIAgent", AIAgentSchema);

export default AIAgent;
