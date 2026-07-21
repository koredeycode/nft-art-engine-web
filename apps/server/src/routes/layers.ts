import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  createLayerSchema,
  updateElementWeightSchema,
} from "@nft-engine/shared";
import { db } from "../db/index.js";
import { layers, elements } from "../db/schema.js";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

export const layersRouter = new Hono();

layersRouter.get("/project/:projectId", async (c) => {
  const projectId = c.req.param("projectId");
  const result = await db
    .select()
    .from(layers)
    .where(eq(layers.projectId, projectId))
    .orderBy(layers.order)
    .all();
  return c.json(result);
});

layersRouter.post(
  "/project/:projectId",
  zValidator("json", createLayerSchema),
  async (c) => {
    const projectId = c.req.param("projectId");
    const data = c.req.valid("json");
    const now = new Date();
    const existingLayers = await db
      .select()
      .from(layers)
      .where(eq(layers.projectId, projectId))
      .all();
    const layer = {
      id: crypto.randomUUID(),
      projectId,
      name: data.name,
      order: existingLayers.length,
      createdAt: now,
      updatedAt: now,
    };
    await db.insert(layers).values(layer).run();
    return c.json(layer, 201);
  },
);

layersRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(elements).where(eq(elements.layerId, id)).run();
  await db.delete(layers).where(eq(layers.id, id)).run();
  return c.json({ ok: true });
});

layersRouter.get("/:layerId/elements", async (c) => {
  const layerId = c.req.param("layerId");
  const result = await db
    .select()
    .from(elements)
    .where(eq(elements.layerId, layerId))
    .all();
  return c.json(result);
});

layersRouter.patch(
  "/elements/:elementId/weight",
  zValidator("json", updateElementWeightSchema),
  async (c) => {
    const elementId = c.req.param("elementId");
    const data = c.req.valid("json");
    await db
      .update(elements)
      .set({ weight: data.weight })
      .where(eq(elements.id, elementId))
      .run();
    return c.json({ ok: true });
  },
);
