import { Button } from "@/components/ui/button";
import { IJob } from "@/models/Job";
import { listJobs } from "@/server/jobs/actions";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function page() {
  const { permissions, organizationId } = await withAuth();
  if (!organizationId) return <div>No organization id</div>;
  const data = await listJobs(organizationId);
  if (!data.success) {
    return <div>Error</div>;
  }
  const jobs = JSON.parse(data.data!) as IJob[];

  return (
    <div>
      {permissions?.includes("jobs:create") && (
        <Button asChild>
          <Link href="/jobs/create">
            <PlusCircleIcon />
            Create Job
          </Link>
        </Button>
      )}
      <div className="mt-2 flex flex-col gap-4">
        {jobs.map((job) => (
          <Link href={`/jobs/${job._id}`} key={job._id as string}>
            {job.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
