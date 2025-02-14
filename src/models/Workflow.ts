import mongoose, { Document, Schema } from "mongoose";
import { IJobNode, JobNodeSchema } from "./JobNode";
import { IJobEdge, JobEdgeSchema } from "./JobEdge";

export interface IWorkflow extends Document {
  nodes: IJobNode[];
  edges: IJobEdge[];
}

export const WorkflowSchema = new Schema(
  {
    nodes: [JobNodeSchema],
    edges: [JobEdgeSchema],
  },
  { _id: false }
);
