import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { zValidator } from "@hono/zod-validator";
import { startGenerationSchema } from "@nft-engine/shared";
import { eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { elements, generationJobs, layers, projects } from "../db/schema.js";
import { generate } from "../engine/generator.js";
import { logger } from "../lib/logger.js";
import { broadcastJobProgress } from "../lib/ws.js";

export async function cleanupOrphanedJobs() {
  try {
    const orphanedJobs = await db
      .select()
      .from(generationJobs)
      .where(inArray(generationJobs.status, ["running", "queued"]))
      .all();

    if (orphanedJobs.length > 0) {
      await db
        .update(generationJobs)
        .set({
          status: "failed",
          error: "Server process restarted mid-generation.",
          updatedAt: new Date(),
        })
        .where(inArray(generationJobs.status, ["running", "queued"]))
        .run();
      logger.info({ count: orphanedJobs.length }, "cleaned up orphaned generation jobs on startup");
    }
  } catch (err) {
    logger.error({ err }, "failed to clean up orphaned generation jobs");
  }
}

export const generationRouter = new Hono();

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? "./data/uploads";
const BUILD_DIR = process.env.BUILD_DIR ?? "./data/build";
const INPUT_DIR = "./data/generation_input";

async function runGenerationJob(jobId: string, projectId: string, totalEditions: number) {
  try {
    const project = await db.select().from(projects).where(eq(projects.id, projectId)).get();
    if (!project) throw new Error("Project not found");

    const projectLayers = await db
      .select()
      .from(layers)
      .where(eq(layers.projectId, projectId))
      .orderBy(layers.order)
      .all();

    if (projectLayers.length === 0) {
      throw new Error("No layers configured for this project");
    }

    const stageBaseDir = path.join(INPUT_DIR, projectId);
    const outputJobDir = path.join(BUILD_DIR, jobId);

    // Clean or create staging & output directories
    if (fs.existsSync(stageBaseDir)) {
      fs.rmSync(stageBaseDir, { recursive: true, force: true });
    }
    fs.mkdirSync(stageBaseDir, { recursive: true });

    fs.mkdirSync(path.join(outputJobDir, "images"), { recursive: true });
    fs.mkdirSync(path.join(outputJobDir, "json"), { recursive: true });
    fs.mkdirSync(path.join(outputJobDir, "gifs"), { recursive: true });

    const layersOrder: { name: string; options?: { blend?: string } }[] = [];

    for (const l of projectLayers) {
      const sanitizedLayerName = l.name.replace(/[^a-zA-Z0-9_-]/g, "_");
      const layerFolder = path.join(stageBaseDir, sanitizedLayerName);
      fs.mkdirSync(layerFolder, { recursive: true });

      layersOrder.push({
        name: sanitizedLayerName,
        options: {
          blend: l.blendMode ?? "source-over",
        },
      });

      const layerElements = await db
        .select()
        .from(elements)
        .where(eq(elements.layerId, l.id))
        .all();

      if (layerElements.length === 0) {
        throw new Error(`Layer "${l.name}" has no elements uploaded.`);
      }

      for (const el of layerElements) {
        const sourcePath = path.join(UPLOADS_DIR, el.filename);
        if (fs.existsSync(sourcePath)) {
          const ext = path.extname(el.filename) || ".png";
          const rawName = path.basename(el.filename, ext).replace(/[^a-zA-Z0-9]/g, "");
          const targetFilename = `${rawName}#${el.weight}${ext}`;
          fs.copyFileSync(sourcePath, path.join(layerFolder, targetFilename));
        }
      }
    }

    // Update job status to running
    await db
      .update(generationJobs)
      .set({
        status: "running",
        startedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(generationJobs.id, jobId))
      .run();

    broadcastJobProgress(jobId, "running", 0, 0, totalEditions);
    logger.info({ jobId, projectId, totalEditions }, "generation job started");

    const rarityDelimiter = project.rarityDelim ?? "#";
    const dnaTolerance =
      !project.dnaTolerance || project.dnaTolerance <= 10 ? 10000 : project.dnaTolerance;
    const shuffleOrder = project.shuffleOrder ?? false;
    const canvasWidth = project.canvasWidth ?? 512;
    const canvasHeight = project.canvasHeight ?? 512;
    const network = project.network === "sol" ? "sol" : "eth";

    const config = {
      render: {
        width: canvasWidth,
        height: canvasHeight,
        smoothing: project.smoothing ?? true,
      },
      background: {
        generate: project.bgGenerate ?? false,
        brightness: project.bgBrightness ?? "100%",
        static: project.bgStatic ?? false,
        default: project.bgDefault ?? "#ffffff",
      },
      metadata: {
        namePrefix: project.namePrefix ?? project.name,
        description: project.description ?? "",
        baseUri: project.baseUri ?? "ipfs://NewUriToReplace",
        network: network as "eth" | "sol",
        solanaMetadata: {
          symbol: "NFT",
          seller_fee_basis_points: 500,
          external_url: "https://nftartengine.io",
          creators: [],
        },
        extraMetadata: (project.extraMetadata as Record<string, unknown>) ?? {},
      },
      gif: {
        export: false,
        repeat: 0,
        quality: 100,
        delay: 500,
      },
      layersBaseDir: stageBaseDir,
      outputDir: outputJobDir,
      rarityDelimiter,
      dnaTolerance,
      shuffleOrder,
      layerConfigurations: [
        {
          growEditionSizeTo: totalEditions,
          layersOrder,
        },
      ],
    };

    const logStep = Math.max(1, Math.floor(totalEditions / 10));

    await generate(config, async (prog) => {
      const progressPercent = Math.min(
        100,
        Math.round((prog.currentEdition / totalEditions) * 100),
      );
      await db
        .update(generationJobs)
        .set({
          currentEdition: prog.currentEdition,
          progress: progressPercent,
          updatedAt: new Date(),
        })
        .where(eq(generationJobs.id, jobId))
        .run();

      broadcastJobProgress(jobId, "running", progressPercent, prog.currentEdition, totalEditions);

      if (prog.currentEdition % logStep === 0 || prog.currentEdition === totalEditions) {
        logger.info(
          { jobId, currentEdition: prog.currentEdition, totalEditions, progressPercent },
          `generation progress: ${prog.currentEdition}/${totalEditions} (${progressPercent}%)`,
        );
      }
    });

    await db
      .update(generationJobs)
      .set({
        status: "completed",
        progress: 100,
        currentEdition: totalEditions,
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(generationJobs.id, jobId))
      .run();

    broadcastJobProgress(jobId, "completed", 100, totalEditions, totalEditions);
    logger.info({ jobId, totalEditions }, "generation job completed successfully");
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;
    logger.error({ jobId, error: errorMsg, stack: errorStack }, "Generation job failed");

    await db
      .update(generationJobs)
      .set({
        status: "failed",
        error: errorMsg,
        updatedAt: new Date(),
      })
      .where(eq(generationJobs.id, jobId))
      .run();

    broadcastJobProgress(jobId, "failed", 0, 0, totalEditions);
  }
}

generationRouter.post("/start/:projectId", zValidator("json", startGenerationSchema), async (c) => {
  const projectId = c.req.param("projectId");
  const data = c.req.valid("json");
  const project = await db.select().from(projects).where(eq(projects.id, projectId)).get();

  if (!project) return c.json({ error: "project not found" }, 404);

  const now = new Date();
  const jobId = crypto.randomUUID();
  const totalEditions = data.totalEditions ?? 10;

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

  logger.info({ jobId, projectId, totalEditions }, "generation job queued");

  // Execute generation asynchronously
  runGenerationJob(jobId, projectId, totalEditions);

  return c.json({ jobId, status: "queued", totalEditions }, 202);
});

generationRouter.get("/status/:jobId", async (c) => {
  const jobId = c.req.param("jobId");
  const job = await db.select().from(generationJobs).where(eq(generationJobs.id, jobId)).get();
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

generationRouter.post("/cancel/:jobId", async (c) => {
  const jobId = c.req.param("jobId");
  const job = await db.select().from(generationJobs).where(eq(generationJobs.id, jobId)).get();
  if (!job) return c.json({ error: "not found" }, 404);

  if (job.status === "running" || job.status === "queued") {
    await db
      .update(generationJobs)
      .set({
        status: "cancelled",
        error: "Generation job cancelled",
        updatedAt: new Date(),
      })
      .where(eq(generationJobs.id, jobId))
      .run();
    broadcastJobProgress(
      jobId,
      "cancelled",
      job.progress ?? 0,
      job.currentEdition ?? 0,
      job.totalEditions,
    );
  }

  return c.json({ status: "cancelled" });
});
