import { z } from "zod";

export const createLayerSchema = z.object({
  name: z.string().min(1).max(100),
  blendMode: z.string().optional(),
});

export const updateLayerSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  blendMode: z.string().optional(),
});

export const reorderLayersSchema = z.object({
  layers: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    }),
  ),
});

export const updateElementWeightSchema = z.object({
  weight: z.number().int().nonnegative(),
});

export type CreateLayerInput = z.infer<typeof createLayerSchema>;
export type UpdateLayerInput = z.infer<typeof updateLayerSchema>;
export type ReorderLayersInput = z.infer<typeof reorderLayersSchema>;
export type UpdateElementWeightInput = z.infer<typeof updateElementWeightSchema>;
