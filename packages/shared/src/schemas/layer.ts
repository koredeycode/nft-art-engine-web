import { z } from "zod";

export const createLayerSchema = z.object({
  name: z.string().min(1).max(100),
});

export const updateElementWeightSchema = z.object({
  weight: z.number().int().positive(),
});

export type CreateLayerInput = z.infer<typeof createLayerSchema>;
export type UpdateElementWeightInput = z.infer<typeof updateElementWeightSchema>;
