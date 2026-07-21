import { z } from "zod";

export const startGenerationSchema = z.object({
  layerConfigId: z.string().optional(),
});

export const generationStatusSchema = z.object({
  jobId: z.string(),
  status: z.enum(["queued", "running", "completed", "failed", "cancelled"]),
  progress: z.number().min(0).max(100),
  currentEdition: z.number().optional(),
  totalEditions: z.number(),
});

export type StartGenerationInput = z.infer<typeof startGenerationSchema>;
export type GenerationStatus = z.infer<typeof generationStatusSchema>;
