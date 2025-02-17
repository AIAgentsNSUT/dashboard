import { Button } from "@/components/ui/button";
import { IJob } from "@/models/Job";
import { getJob } from "@/server/jobs/actions";
import { PenIcon } from "lucide-react";
import Link from "next/link";
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
      <div className="flex items-center justify-between p-4 pb-0">
        <h1 className="text-2xl font-bold">Job - {job.title}</h1>
        <Link href={`/jobs/${job._id}/edit`}>
          <Button variant="outline">
            <PenIcon className="w-4 h-4 mr-2" />
            Edit Job
          </Button>
        </Link>
      </div>

      <div className="flex m-4 gap-4 h-full">
        <div className="h-full w-full bg-sidebar-accent rounded-md border-foreground border-2 border-dotted"></div>
      </div>
    </div>
  );
}
