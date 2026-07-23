import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { zValidator } from "@hono/zod-validator";
import {
  createLayerSchema,
  reorderLayersSchema,
  updateElementWeightSchema,
  updateLayerSchema,
} from "@mintrix/shared";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { elements, layers } from "../db/schema.js";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? "./data/uploads";

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

layersRouter.post("/project/:projectId", zValidator("json", createLayerSchema), async (c) => {
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
    blendMode: data.blendMode ?? "source-over",
    order: existingLayers.length,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(layers).values(layer).run();
  return c.json(layer, 201);
});

layersRouter.patch(
  "/project/:projectId/reorder",
  zValidator("json", reorderLayersSchema),
  async (c) => {
    const data = c.req.valid("json");
    for (const item of data.layers) {
      await db
        .update(layers)
        .set({ order: item.order, updatedAt: new Date() })
        .where(eq(layers.id, item.id))
        .run();
    }
    return c.json({ ok: true });
  },
);

layersRouter.patch("/:id", zValidator("json", updateLayerSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  await db
    .update(layers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(layers.id, id))
    .run();
  const updated = await db.select().from(layers).where(eq(layers.id, id)).get();
  return c.json(updated);
});

layersRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const layerElements = await db.select().from(elements).where(eq(elements.layerId, id)).all();

  for (const el of layerElements) {
    const filePath = path.join(UPLOADS_DIR, el.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // ignore deletion errors
      }
    }
  }

  await db.delete(elements).where(eq(elements.layerId, id)).run();
  await db.delete(layers).where(eq(layers.id, id)).run();
  return c.json({ ok: true });
});

layersRouter.get("/:layerId/elements", async (c) => {
  const layerId = c.req.param("layerId");
  const result = await db.select().from(elements).where(eq(elements.layerId, layerId)).all();
  return c.json(result);
});

layersRouter.post("/:layerId/elements", async (c) => {
  const layerId = c.req.param("layerId");
  const layer = await db.select().from(layers).where(eq(layers.id, layerId)).get();
  if (!layer) return c.json({ error: "Layer not found" }, 404);

  const body = await c.req.parseBody();
  const file = body.file;
  const weight = Number(body.weight ?? 1);

  if (
    !file ||
    typeof file === "string" ||
    Array.isArray(file) ||
    typeof file.arrayBuffer !== "function"
  ) {
    return c.json({ error: "Image file is required" }, 400);
  }

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const fileObj = file as File;
  const originalName = fileObj.name || "element.png";
  const fileExt = path.extname(originalName) || ".png";
  const elementId = crypto.randomUUID();
  const storedFilename = `${elementId}_${Date.now()}${fileExt}`;
  const targetPath = path.join(UPLOADS_DIR, storedFilename);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(targetPath, buffer);

  const elementRecord = {
    id: elementId,
    layerId,
    filename: storedFilename,
    weight,
    createdAt: new Date(),
  };

  await db.insert(elements).values(elementRecord).run();
  return c.json(elementRecord, 201);
});

layersRouter.get("/elements/:elementId/file", async (c) => {
  const elementId = c.req.param("elementId");
  const el = await db.select().from(elements).where(eq(elements.id, elementId)).get();
  if (!el) return c.json({ error: "Element not found" }, 404);

  const filePath = path.join(UPLOADS_DIR, el.filename);
  if (!fs.existsSync(filePath)) return c.json({ error: "File not found" }, 404);

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(el.filename).toLowerCase();
  const contentType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";

  return c.newResponse(buffer, {
    headers: { "Content-Type": contentType },
  });
});

layersRouter.patch(
  "/elements/:elementId/weight",
  zValidator("json", updateElementWeightSchema),
  async (c) => {
    const elementId = c.req.param("elementId");
    const data = c.req.valid("json");
    await db.update(elements).set({ weight: data.weight }).where(eq(elements.id, elementId)).run();
    return c.json({ ok: true });
  },
);

layersRouter.delete("/elements/:elementId", async (c) => {
  const elementId = c.req.param("elementId");
  const el = await db.select().from(elements).where(eq(elements.id, elementId)).get();
  if (el) {
    const filePath = path.join(UPLOADS_DIR, el.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {
        // ignore error
      }
    }
    await db.delete(elements).where(eq(elements.id, elementId)).run();
  }
  return c.json({ ok: true });
});
