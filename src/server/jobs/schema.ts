import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  collaborators: z
    .array(
      z.object({
        email: z.string().email(),
        userId: z.string(),
        invitedAt: z.string().or(z.date()),
        acceptedAt: z.string().or(z.date()).optional(),
      })
    )
    .optional()
    .default([]),
});

export type JobFormData = z.infer<typeof jobSchema>;
