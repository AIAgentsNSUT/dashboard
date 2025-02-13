import mongoose, { Document, Schema } from "mongoose";
import { CollaboratorSchema, ICollaborator } from "./Collaborator";
import { IWorkflow, WorkflowSchema } from "./Workflow";

export interface IJob extends Document {
  title: string;
  description?: string;
  org: mongoose.Types.ObjectId;
  createdBy: string;
  collaborators: ICollaborator[];
  workflow: IWorkflow;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    description: { type: String },
    org: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    createdBy: { type: String, required: true },
    collaborators: [CollaboratorSchema],
    workflow: WorkflowSchema,
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
export default Job;
