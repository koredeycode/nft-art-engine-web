import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createProjectSchema, updateProjectSchema } from "@nft-engine/shared";
import { db } from "../db/index.js";
import { projects } from "../db/schema.js";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

export const projectsRouter = new Hono();

projectsRouter.get("/", async (c) => {
  const all = await db.select().from(projects).all();
  return c.json(all);
});

projectsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const project = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .get();
  if (!project) return c.json({ error: "not found" }, 404);
  return c.json(project);
});

projectsRouter.post(
  "/",
  zValidator("json", createProjectSchema),
  async (c) => {
    const data = c.req.valid("json");
    const now = new Date();
    const project = {
      id: crypto.randomUUID(),
      userId: "default",
      name: data.name,
      createdAt: now,
      updatedAt: now,
    };
    await db.insert(projects).values(project).run();
    return c.json(project, 201);
  },
);

projectsRouter.patch(
  "/:id",
  zValidator("json", updateProjectSchema),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const existing = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .get();
    if (!existing) return c.json({ error: "not found" }, 404);
    await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .run();
    const updated = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .get();
    return c.json(updated);
  },
);

projectsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(projects).where(eq(projects.id, id)).run();
  return c.json({ ok: true });
});
