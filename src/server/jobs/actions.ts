"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import Job from "@/models/Job";
import { connectDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { JobFormData } from "./schema";
import useOrgStore from "@/server/organisation";

export async function createJob(input: JobFormData) {
  try {
    const { user, organizationId } = await withAuth();
    if (!organizationId)
      return { success: false, error: "No organization found" };
    if (!user) return { success: false, error: "No user found" };

    const org = await useOrgStore.getState().getOrgByWorkOSId(organizationId);

    if (!org) return { success: false, error: "No organization found" };

    await connectDB();

    const job = await Job.create({
      ...input,
      description: input.description?.trim() || null,
      org: org._id,
      createdBy: user.id,
      workflow: {
        nodes: [],
        edges: [],
      },
    });

    revalidatePath("/jobs");
    return { success: true, data: JSON.stringify(job) };
  } catch (error) {
    console.error("Error creating job:", error);
    return { success: false, error: "Failed to create job" };
  }
}

export async function updateJob({
  id,
  ...input
}: JobFormData & { id: string }) {
  try {
    const { organizationId } = await withAuth();
    if (!organizationId)
      return { success: false, error: "No organization found" };

    const org = await useOrgStore.getState().getOrgByWorkOSId(organizationId);
    if (!org) return { success: false, error: "No organization found" };
    await connectDB();

    const job = await Job.findOneAndUpdate(
      { _id: id, org: org._id },
      {
        ...input,
        description: input.description?.trim() || null,
      },
      { new: true }
    );

    if (!job) {
      return { success: false, error: "Job not found" };
    }

    revalidatePath("/jobs");
    return { success: true, data: JSON.stringify(job) };
  } catch (error) {
    console.error("Error updating job:", error);
    return { success: false, error: "Failed to update job" };
  }
}

export async function getJob(id: string) {
  try {
    const { organizationId } = await withAuth();
    if (!organizationId)
      return { success: false, error: "No organization found" };
    const org = await useOrgStore.getState().getOrgByWorkOSId(organizationId);
    if (!org) return { success: false, error: "No organization found" };
    await connectDB();
    const job = await Job.findOne({ _id: id, org: org._id });
    if (!job) return { success: false, error: "Job not found" };
    return {
      success: true,
      data: JSON.stringify(job),
    };
  } catch (error) {
    console.error("Error getting job:", error);
    return { success: false, error: "Failed to get job" };
  }
}

export async function listJobs(organizationId: string, userId?: string) {
  try {
    if (!organizationId) {
      return { success: false, error: "No organization found" };
    }

    const org = await useOrgStore.getState().getOrgByWorkOSId(organizationId);
    if (!org) {
      return { success: false, error: "No organization found" };
    }

    await connectDB();

    const filter = {
      org: org._id,
      $or: [{ createdBy: userId }, { "collaborators.userId": userId }],
    };

    const jobs = await Job.find(userId ? filter : { org: org._id });
    return { success: true, data: JSON.stringify(jobs) };
  } catch (error) {
    console.error("Error listing jobs:", error);
    return { success: false, error: "Failed to list jobs" };
  }
}
