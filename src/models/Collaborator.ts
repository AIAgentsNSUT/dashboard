import { Schema } from "mongoose";

export interface ICollaborator {
  userId: string;
  invitedAt: Date;
  acceptedAt?: Date;
}

export const CollaboratorSchema = new Schema<ICollaborator>({
  userId: { type: String, required: true },
  invitedAt: { type: Date, required: true, default: Date.now },
  acceptedAt: { type: Date },
});
