import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import type { Server } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { projectsRouter } from "./routes/projects.js";
import { layersRouter } from "./routes/layers.js";
import { generationRouter } from "./routes/generation.js";
import { exportsRouter } from "./routes/exports.js";
import { auth } from "./lib/auth.js";
import { logger } from "./lib/logger.js";
import { initTelemetry } from "./lib/observability.js";
import { initWebSocket } from "./lib/ws.js";
import { runMigrations } from "./db/migrate.js";

initTelemetry();

await runMigrations();

const app = new Hono();

app.use("*", cors());

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/projects", projectsRouter);
app.route("/api/layers", layersRouter);
app.route("/api/generation", generationRouter);
app.route("/api/exports", exportsRouter);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR ?? "data/uploads");
app.get("/api/uploads/:filename", async (c) => {
  const filename = c.req.param("filename");
  const filePath = path.join(UPLOADS_DIR, path.basename(filename));
  if (!fs.existsSync(filePath)) return c.json({ error: "not found" }, 404);
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const mime =
    ext === ".png" ? "image/png" :
    ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
    ext === ".gif" ? "image/gif" :
    "application/octet-stream";
  return c.newResponse(buffer, { headers: { "Content-Type": mime } });
});

const port = Number(process.env.PORT ?? 3001);

const server = serve({ fetch: app.fetch, port }, () => {
  logger.info({ port }, "server listening");
});

initWebSocket(server as unknown as Server);

export default app;
