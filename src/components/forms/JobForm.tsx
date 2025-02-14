"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createJob, updateJob } from "@/server/jobs/actions";
import { toast } from "sonner";
import { jobSchema, type JobFormData } from "@/server/jobs/schema";
import { IJob } from "@/models/Job";

interface JobFormProps {
  initialData?: IJob;
}

export default function JobForm({ initialData }: JobFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const mode = initialData ? "update" : "create";

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      collaborators: initialData?.collaborators?.map((c) => c.userId) || [],
    },
  });

  const mutation = useMutation({
    mutationFn: mode === "create" ? createJob : updateJob,
    onSuccess: (data) => {
      if (data.success) {
        const job = JSON.parse(data.data!);
        toast.success(
          mode === "create"
            ? "Job created successfully"
            : "Job updated successfully"
        );
        router.replace(`/jobs/${job._id}`);
      } else {
        toast.error(data.error);
      }
    },
    onError: (error) => {
      toast.error(`Failed to ${mode} job`);
      console.error(`Error ${mode}ing job:`, error);
    },
  });

  const onSubmit = (data: JobFormData) => {
    if (mode === "update" && initialData) {
      const updateData = {
        id: initialData._id,
        ...data,
      };
      // @ts-ignore
      mutation.mutate(updateData);
    } else {
      // @ts-ignore
      mutation.mutate(data);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          {mode === "create" ? "Create New Job" : "Update Job"}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter job title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter job description"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" onClick={() => setStep(2)}>
                    Next: Invite Collaborators
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Invite Collaborators</h2>
                <p className="text-gray-600">
                  You can invite team members to collaborate on this job.
                </p>

                {/* WorkOS Directory UI integration would go here */}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <div className="space-x-2">
                    <Button type="submit" disabled={mutation.isPending}>
                      {mutation.isPending
                        ? mode === "create"
                          ? "Creating..."
                          : "Updating..."
                        : mode === "create"
                        ? "Create Job"
                        : "Update Job"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
}
