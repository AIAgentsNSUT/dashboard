import JobWorkflow from "@/components/JobWorkflow";
import { IJob } from "@/models/Job";
import { getJob } from "@/server/jobs/actions";
import { notFound } from "next/navigation";
import React from "react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function page({ params }: PageProps) {
  const { id } = await params;
  const data = await getJob(id);
  if (!data.success) {
    notFound();
  }
  const job = JSON.parse(data.data!) as IJob;

  return (
    <div className="flex flex-col h-full">
      <JobWorkflow job={job} />
    </div>
  );
}
