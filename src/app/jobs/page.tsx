import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IJob } from "@/models/Job";
import { listJobs } from "@/server/jobs/actions";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { PlusCircleIcon, UserIcon, UsersIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function page() {
  const { permissions, organizationId, user } = await withAuth();
  if (!organizationId) return <div>No organization id</div>;

  const data = await listJobs(organizationId, user.id);
  if (!data.success) {
    return <div>Error</div>;
  }
  const jobs = JSON.parse(data.data!) as IJob[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between items-start gap-4">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold">Jobs</h1>
          {permissions?.includes("jobs:create") && (
            <Button asChild>
              <Link href="/jobs/create" className="flex items-center gap-2">
                <PlusCircleIcon className="w-4 h-4" />
                Create Job
              </Link>
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            Created by me
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            Collaborating
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            Pending Invite
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => {
          const isCreator = job.createdBy === user.id;
          const collaborator = job.collaborators.find(
            (c) => c.userId === user.id
          );
          const isPending = collaborator && !collaborator.acceptedAt;
          const isCollaborating = collaborator && collaborator.acceptedAt;

          let statusColor = "";
          let statusIcon = null;
          if (isCreator) {
            statusColor = "border-l-blue-500";
            statusIcon = <UserIcon className="w-4 h-4 text-blue-500" />;
          } else if (isCollaborating) {
            statusColor = "border-l-green-500";
            statusIcon = <UsersIcon className="w-4 h-4 text-green-500" />;
          } else if (isPending) {
            statusColor = "border-l-amber-500";
            statusIcon = <ClockIcon className="w-4 h-4 text-amber-500" />;
          }

          return (
            <Link href={`/jobs/${job._id}`} key={job._id as string}>
              <Card className={`p-4 border-l-4 ${statusColor}`}>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg">{job.title}</h3>
                    {job.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {job.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">{statusIcon}</div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {job.collaborators.length > 0 && (
                    <span>
                      {job.collaborators.length} collaborator
                      {job.collaborators.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
