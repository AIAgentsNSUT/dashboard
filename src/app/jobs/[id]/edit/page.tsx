import JobForm from "@/components/forms/JobForm";
import { getJob } from "@/server/jobs/actions";
import { notFound } from "next/navigation";

export default async function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getJob(params.id);
  if (!data.success) {
    notFound();
  }
  const job = JSON.parse(data.data!);
  return <JobForm initialData={job} />;
}
