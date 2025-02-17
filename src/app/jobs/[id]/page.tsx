import { Button } from "@/components/ui/button";
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
  const job = JSON.parse(data.data!);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Job {job._id}</h1>
        <Link href={`/jobs/${job._id}/edit`}>
          <Button variant="outline">
            <PenIcon className="w-4 h-4 mr-2" />
            Edit Job
          </Button>
        </Link>
      </div>
    </div>
  );
}
