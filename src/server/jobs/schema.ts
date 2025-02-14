import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  collaborators: z.array(z.string()).optional().default([]),
});

export type JobFormData = z.infer<typeof jobSchema>;
