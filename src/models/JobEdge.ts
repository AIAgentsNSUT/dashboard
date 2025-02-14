import { Schema } from "mongoose";

export interface IJobEdge {
  id: string;
  source?: string;
  target?: string;
  label?: string;
}

export const JobEdgeSchema = new Schema<IJobEdge>(
  {
    id: { type: String, required: true },
    source: {
      type: String,
    },
    target: {
      type: String,
    },
    label: { type: String },
  },
  { _id: false }
);
