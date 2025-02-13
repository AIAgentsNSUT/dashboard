import { fileTypes } from "@/lib/data";
import mongoose, { Document, Schema } from "mongoose";

export interface IFileAttachment {
  url: string;
  fileType: FileType;
  size: number;
  label: string;
  description?: string;
  uploadedAt: Date;
  uploadedBy: string;
}

const FileAttachmentSchema = new Schema<IFileAttachment>({
  url: { type: String, required: true },
  fileType: {
    type: String,
    enum: fileTypes,
    required: true,
  },
  size: { type: Number, required: true },
  label: { type: String, required: true },
  description: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: {
    type: String,
    default: "system_output",
  },
});

const FileAttachment =
  mongoose.models.FileAttachment ||
  mongoose.model<IFileAttachment>("FileAttachment", FileAttachmentSchema);

export default FileAttachment;
