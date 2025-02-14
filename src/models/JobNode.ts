import { Schema } from "mongoose";
import { AgentOutputSchema, IAgentOutput } from "./AgentOutput";
import { IMessage, MessageSchema } from "./Message";
import { agentStates } from "@/lib/data";

interface NodeData {
  status: AgentState;
  agentId: string;
  agentVersion: number;
  output: IAgentOutput[];
  messages: IMessage[];
}

export interface IJobNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: NodeData;
}

const NodeDataSchema = new Schema({
  status: { type: String, enum: agentStates, required: true },
  agentId: { type: String, required: true },
  agentVersion: { type: Number, required: true },
  currentOutput: [AgentOutputSchema],
  originalOutput: [AgentOutputSchema],
  messages: [MessageSchema],
});

export const JobNodeSchema = new Schema<IJobNode>(
  {
    id: { type: String, required: true },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    data: {
      type: NodeDataSchema,
      required: true,
    },
  },
  { _id: false }
);
