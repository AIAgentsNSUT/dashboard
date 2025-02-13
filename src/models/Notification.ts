import { notificationStatus, notificationTypes } from "@/lib/data";
import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId: string;
  job: mongoose.Types.ObjectId;
  nodeId?: mongoose.Types.ObjectId;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    nodeId: { type: mongoose.Schema.Types.ObjectId, ref: "JobNode" },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: notificationTypes,
      required: true,
    },
    status: {
      type: String,
      enum: notificationStatus,
      default: notificationStatus[0],
    },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
