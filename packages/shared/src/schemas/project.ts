import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  network: z.enum(["eth", "sol"]).optional(),
  namePrefix: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  baseUri: z.string().optional(),
  canvasWidth: z.number().int().positive().max(4096).optional(),
  canvasHeight: z.number().int().positive().max(4096).optional(),
  smoothing: z.boolean().optional(),
  rarityDelim: z.string().length(1).optional(),
  dnaTolerance: z.number().int().positive().optional(),
  bgGenerate: z.boolean().optional(),
  bgBrightness: z.string().optional(),
  bgStatic: z.boolean().optional(),
  bgDefault: z.string().optional(),
  shuffleOrder: z.boolean().optional(),
  extraMetadata: z.record(z.unknown()).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
