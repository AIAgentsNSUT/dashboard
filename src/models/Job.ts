import mongoose, { Document, Schema } from "mongoose";

export interface IAgentRuntimeData extends Document {
  agentDataId: mongoose.Types.ObjectId;
  value: any;
  originalValue: any;
  edited: boolean;
  editedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgentRuntimeDataSchema = new Schema<IAgentRuntimeData>(
  {
    agentDataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIAgentData",
      required: true,
    },
    value: { type: Schema.Types.Mixed, required: true },
    originalValue: { type: Schema.Types.Mixed, required: true },
    edited: { type: Boolean, default: false },
    editedBy: { type: String },
  },
  { timestamps: true }
);

export interface IJobNode extends Document {
  nodeId: string;
  agentId: mongoose.Types.ObjectId;
  status: string;

  runtimeData: IAgentRuntimeData[];
  position: { x: number; y: number };
}

const JobNodeSchema = new Schema<IJobNode>(
  {
    nodeId: { type: String, required: true },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIAgent",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "running", "completed", "failed"],
    },
    runtimeData: [AgentRuntimeDataSchema],
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export interface IJobEdge extends Document {
  edgeId: string;
  source: string;
  target: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobEdgeSchema = new Schema<IJobEdge>(
  {
    edgeId: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
  },
  { timestamps: true }
);

export interface ICollaborator extends Document {
  userId: string;
  email: string;
  invitedAt: Date;
  acceptedAt?: Date;
}

const CollaboratorSchema = new Schema<ICollaborator>({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  invitedAt: { type: Date, required: true, default: Date.now },
  acceptedAt: { type: Date },
});

export interface IJob extends Document {
  title: string;
  description?: string;
  org: mongoose.Types.ObjectId;
  createdBy: string;
  collaborators: ICollaborator[];
  workflow: {
    nodes: IJobNode[];
    edges: IJobEdge[];
  };
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
    workflow: {
      nodes: [JobNodeSchema],
      edges: [JobEdgeSchema],
    },
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
export default Job;
