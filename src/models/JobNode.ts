import mongoose, { Schema } from "mongoose";
import { IMessage } from "./Message";
import { IAgentOutput } from "./AgentOutput";
import { nodeTypes } from "@/lib/data";

type NodeData =
  | {
      type: "aiAgent";
      agentId: string;
      inputid: string;
      agentVersion: number;
      currentOutput: IAgentOutput;
      originalOutput: IAgentOutput;
      outputHistory: IAgentOutput[];
    }
  | { type: "discussion"; messages: IMessage[] }
  | {
      type: "approval";
      requiredBy: string;
      approved: boolean;
      approvedBy?: string;
      approvedAt?: Date;
      comments: IMessage[];
    }
  | { type: "input"; inputText: string; enteredBy: string; timestamp: Date }
  | { type: "fileAttachment"; fileId: mongoose.Types.ObjectId };

export interface IJobNode {
  id: string;
  type: NodeType;
  position: {
    x: number;
    y: number;
  };
  data: NodeData | null;
}

export const JobNodeSchema = new Schema<IJobNode>(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: nodeTypes,
      required: true,
    },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);
