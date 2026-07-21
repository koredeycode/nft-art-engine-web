import { Hono } from "hono";
import fs from "node:fs";
import path from "node:path";
import { db } from "../db/index.js";
import { generationJobs } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const exportsRouter = new Hono();

const BUILD_DIR = process.env.BUILD_DIR ?? "./data/build";

exportsRouter.get("/:jobId/image/:edition", async (c) => {
  const jobId = c.req.param("jobId");
  const edition = c.req.param("edition");

  const filePath = path.join(BUILD_DIR, "images", `${edition}.png`);
  if (!fs.existsSync(filePath)) return c.json({ error: "not found" }, 404);

  const buffer = fs.readFileSync(filePath);
  return c.newResponse(buffer, {
    headers: { "Content-Type": "image/png" },
  });
});

exportsRouter.get("/:jobId/json/:edition", async (c) => {
  const jobId = c.req.param("jobId");
  const edition = c.req.param("edition");

  const filePath = path.join(BUILD_DIR, "json", `${edition}.json`);
  if (!fs.existsSync(filePath)) return c.json({ error: "not found" }, 404);

  const data = fs.readFileSync(filePath, "utf-8");
  return c.json(JSON.parse(data));
});

exportsRouter.get("/:jobId/metadata", async (c) => {
  const jobId = c.req.param("jobId");

  const filePath = path.join(BUILD_DIR, "json", "_metadata.json");
  if (!fs.existsSync(filePath)) return c.json({ error: "not found" }, 404);

  const data = fs.readFileSync(filePath, "utf-8");
  return c.json(JSON.parse(data));
});

exportsRouter.get("/:jobId/gif/:edition", async (c) => {
  const jobId = c.req.param("jobId");
  const edition = c.req.param("edition");

  const filePath = path.join(BUILD_DIR, "gifs", `${edition}.gif`);
  if (!fs.existsSync(filePath)) return c.json({ error: "not found" }, 404);

  const buffer = fs.readFileSync(filePath);
  return c.newResponse(buffer, {
    headers: { "Content-Type": "image/gif" },
  });
});
