import mongoose, { Schema } from "mongoose";

export interface IJobEdge {
  id: string;
  source: mongoose.Types.ObjectId;
  target: mongoose.Types.ObjectId;
  label?: string;
}

export const JobEdgeSchema = new Schema<IJobEdge>(
  {
    id: { type: String, required: true },
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobNode",
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobNode",
      required: true,
    },
    label: { type: String },
  },
  { _id: false }
);

const JobEdge =
  mongoose.models.JobEdge || mongoose.model<IJobEdge>("JobEdge", JobEdgeSchema);
export default JobEdge;
