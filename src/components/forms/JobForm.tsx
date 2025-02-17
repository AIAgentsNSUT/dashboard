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
import { ICollaborator, IJob } from "@/models/Job";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { searchUserByEmail } from "@/server/users";

interface JobFormProps {
  initialData?: IJob;
}

export default function JobForm({ initialData }: JobFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [invitedCollaborators, setInvitedCollaborators] = useState<
    ICollaborator[]
  >(initialData?.collaborators || []);

  const mode = initialData ? "update" : "create";

  const handleAddCollaborator = async (email: string) => {
    if (!user) {
      toast.error("You must be logged in to invite collaborators");
      return;
    }
    setSearchLoading(true);
    if (email === user.email) {
      toast.error("You can't invite yourself as a collaborator");
      setSearchLoading(false);
      return;
    }

    try {
      const data = await searchUserByEmail(email);
      if (!data) {
        throw new Error("User not found");
      }

      const user = JSON.parse(data);

      if (!invitedCollaborators.some((c) => c.email === email)) {
        setInvitedCollaborators([
          ...invitedCollaborators,
          {
            email: email,
            userId: user.id,
            invitedAt: new Date(),
          },
        ]);
        toast.success(`${email} added as collaborator`);
      } else {
        toast.info(
          `No user found with email ${email}. Admin will need to invite them.`
        );
      }
      setSearchEmail("");
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Failed to add collaborator");
    } finally {
      setSearchLoading(false);
    }
  };

  const removeCollaborator = (email: string) => {
    if (user?.email === email) {
      toast.error("You cannot remove yourself as a collaborator");
      return;
    }

    setInvitedCollaborators((prevCollaborators) =>
      prevCollaborators.filter((collaborator) => collaborator.email !== email)
    );

    toast.success(`Removed ${email} from collaborators`);
  };

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      collaborators: initialData?.collaborators || [],
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
    if (!user) {
      toast.error("You must be logged in to create a job");
      return;
    }

    let submissionData = {
      ...data,
      collaborators: invitedCollaborators,
    };

    if (mode === "update" && initialData) {
      const updateData = {
        id: initialData._id,
        ...submissionData,
      };
      // @ts-ignore
      mutation.mutate(updateData);
    } else {
      submissionData = {
        ...submissionData,
        collaborators: [
          ...invitedCollaborators,
          {
            email: user.email,
            userId: user.id,
            invitedAt: new Date(),
            acceptedAt: new Date(),
          },
        ],
      };
      // @ts-ignore
      mutation.mutate(submissionData);
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

                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Add Collaborator by Email</FormLabel>
                    <div className="flex space-x-2">
                      <Input
                        type="email"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        placeholder="Enter email address"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (searchEmail) handleAddCollaborator(searchEmail);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          searchEmail && handleAddCollaborator(searchEmail)
                        }
                        disabled={searchLoading || !searchEmail}
                      >
                        {searchLoading ? "Adding..." : "Add"}
                      </Button>
                    </div>
                  </FormItem>

                  {/* Invited Collaborators List */}
                  {invitedCollaborators.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium mb-3">
                        Collaborators
                      </h3>
                      <div className="space-y-2">
                        {invitedCollaborators.map((collaborator) => (
                          <div
                            key={collaborator.email}
                            className="flex items-center justify-between p-3 border rounded-md"
                          >
                            <div>
                              <p className="font-medium">
                                {collaborator.email}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeCollaborator(collaborator.email)
                              }
                              disabled={user?.email === collaborator.email}
                            >
                              <span className="text-red-500">Remove</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
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
            )}
          </form>
        </Form>
      </Card>
    </div>
  );
}
