import mongoose, { Document } from "mongoose";

export interface IOrganisation extends Document {
  id: string;
  hostname: string;
  name: string;
  workosId: string;
  website: string;
  logo: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganisationSchema = new mongoose.Schema<IOrganisation>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    hostname: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    workosId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    website: {
      type: String,
      trim: true,
      required: true,
    },
    logo: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

const Organisation =
  mongoose.models.Organisation ||
  mongoose.model("Organisation", OrganisationSchema);

export default Organisation;
