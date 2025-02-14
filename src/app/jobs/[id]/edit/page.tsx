import JobForm from "@/components/forms/JobForm";
import { getJob } from "@/server/jobs/actions";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditJobPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getJob(id);

  if (!data.success) {
    notFound();
  }

  const job = JSON.parse(data.data!);
  return <JobForm initialData={job} />;
}
