import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { startGenerationSchema } from "@nft-engine/shared";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { projects, generationJobs } from "../db/schema.js";
import { logger } from "../lib/logger.js";

export const generationRouter = new Hono();

generationRouter.post(
  "/start/:projectId",
  zValidator("json", startGenerationSchema),
  async (c) => {
    const projectId = c.req.param("projectId");
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .get();

    if (!project) return c.json({ error: "project not found" }, 404);

    const now = new Date();
    const jobId = crypto.randomUUID();
    const totalEditions = 10;

    const job = {
      id: jobId,
      projectId,
      status: "queued" as const,
      totalEditions,
      currentEdition: 0,
      progress: 0,
      createdAt: now,
      updatedAt: now,
    };
    await db.insert(generationJobs).values(job).run();

    logger.info({ jobId, projectId }, "generation job queued");

    return c.json({ jobId, status: "queued" }, 202);
  },
);

generationRouter.get("/status/:jobId", async (c) => {
  const jobId = c.req.param("jobId");
  const job = await db
    .select()
    .from(generationJobs)
    .where(eq(generationJobs.id, jobId))
    .get();
  if (!job) return c.json({ error: "not found" }, 404);
  return c.json(job);
});

generationRouter.get("/jobs/:projectId", async (c) => {
  const projectId = c.req.param("projectId");
  const jobs = await db
    .select()
    .from(generationJobs)
    .where(eq(generationJobs.projectId, projectId))
    .orderBy(generationJobs.createdAt)
    .all();
  return c.json(jobs);
});
