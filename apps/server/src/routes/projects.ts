import crypto from "node:crypto";
import { zValidator } from "@hono/zod-validator";
import { createProjectSchema, updateProjectSchema } from "@mintrix/shared";
import { eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { elements, layers, projects } from "../db/schema.js";
import { getUserFromContext } from "../lib/auth.js";

export const projectsRouter = new Hono();

projectsRouter.get("/", async (c) => {
  const user = await getUserFromContext(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
    .all();

  // Attach layer and element counts for rich dashboard cards
  const projectList = await Promise.all(
    userProjects.map(async (p) => {
      const projLayers = await db.select().from(layers).where(eq(layers.projectId, p.id)).all();

      let elementCount = 0;
      if (projLayers.length > 0) {
        const layerIds = projLayers.map((l) => l.id);
        const projElements = await db
          .select()
          .from(elements)
          .where(inArray(elements.layerId, layerIds))
          .all();
        elementCount = projElements.length;
      }

      return {
        ...p,
        layerCount: projLayers.length,
        elementCount,
      };
    }),
  );

  return c.json(projectList);
});

projectsRouter.get("/:id", async (c) => {
  const user = await getUserFromContext(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const project = await db.select().from(projects).where(eq(projects.id, id)).get();
  if (!project || project.userId !== user.id) return c.json({ error: "Not found" }, 404);
  return c.json(project);
});

projectsRouter.post("/", zValidator("json", createProjectSchema), async (c) => {
  const user = await getUserFromContext(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const data = c.req.valid("json");
  const now = new Date();
  const project = {
    id: crypto.randomUUID(),
    userId: user.id,
    name: data.name,
    createdAt: now,
    updatedAt: now,
  };
  await db.insert(projects).values(project).run();
  return c.json(project, 201);
});

projectsRouter.patch("/:id", zValidator("json", updateProjectSchema), async (c) => {
  const user = await getUserFromContext(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const data = c.req.valid("json");
  const existing = await db.select().from(projects).where(eq(projects.id, id)).get();
  if (!existing || existing.userId !== user.id) return c.json({ error: "Not found" }, 404);

  await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .run();
  const updated = await db.select().from(projects).where(eq(projects.id, id)).get();
  return c.json(updated);
});

projectsRouter.delete("/:id", async (c) => {
  const user = await getUserFromContext(c);
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const existing = await db.select().from(projects).where(eq(projects.id, id)).get();
  if (!existing || existing.userId !== user.id) return c.json({ error: "Not found" }, 404);

  // Delete associated layers and elements
  const projLayers = await db.select().from(layers).where(eq(layers.projectId, id)).all();

  for (const l of projLayers) {
    await db.delete(elements).where(eq(elements.layerId, l.id)).run();
  }
  await db.delete(layers).where(eq(layers.projectId, id)).run();
  await db.delete(projects).where(eq(projects.id, id)).run();
  return c.json({ ok: true });
});
