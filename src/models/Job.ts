import mongoose, { Document, Schema } from "mongoose";

interface ICollaborator {
  userId: string;
  invitedAt: Date;
  acceptedAt?: Date;
}

const CollaboratorSchema = new Schema<ICollaborator>({
  userId: { type: String, required: true },
  invitedAt: { type: Date, required: true, default: Date.now },
  acceptedAt: { type: Date },
});

export interface IJob extends Document {
  title: string;
  description?: string;
  org: mongoose.Types.ObjectId;
  createdBy: string;
  collaborators: ICollaborator[];
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
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
export default Job;
